# Wrapper invoked by the Windows Task Scheduler entry "ThatAIPM Daily Pipeline" (created
# 2026-08-10). Runs Claude Code headlessly, once a day, against automation/daily_pipeline_prompt.md.
#
# This does NOT publish anything -- see that prompt file's own hard limits. It produces a full
# episode (or reports a blocker), writes a one-line result to automation/logs/latest_result.txt,
# and this script pops a native Windows notification from that file. A live session with the
# user is still required to actually schedule/publish via Zernio.
#
# Notification design note, 2026-08-10: originally the prompt called Claude Code's own
# PushNotification tool, but that depends on an active Claude Code terminal/app or a connected
# Remote Control session, neither of which exists for a Task-Scheduler-launched headless run --
# it could silently have "nowhere to go." Switched to a plain Windows Forms balloon-tip
# notification instead, which has no dependency on Claude Code's own session state and reliably
# works the same way any other Windows app's tray notification does.
#
# Logs to automation/logs/daily_pipeline_<timestamp>.log (gitignored) so a failed unattended run
# is debuggable after the fact.
#
# Auth note, 2026-08-11: `claude` on this machine was never signed in via the interactive
# `claude auth login` flow (that's a separate mechanism from this script, tied to
# ~/.claude/.credentials.json). Fixed with a long-lived token from `claude setup-token`,
# stored in .env as CLAUDE_CODE_OAUTH_TOKEN and exported here -- never hardcode it in this
# file, .env is gitignored specifically so secrets never land in a commit.
#
# Prompt-passing note, 2026-08-11: originally passed via `-p $prompt` as a CLI argument.
# claude.cmd is an npm-install batch-file shim, and cmd.exe has a real ~8191-character
# command-line length limit -- the prompt file alone is over 8000 bytes, plausibly why the
# first scheduled run produced an empty log (the process may have failed to even launch).
# Switched to piping the prompt via stdin instead, which has no such limit.

$ErrorActionPreference = "Stop"
$repoRoot = "C:\Users\Vinay\Documents\ThatAIPM\insideaiagents"
Set-Location $repoRoot

$logDir = Join-Path $repoRoot "automation\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$logFile = Join-Path $logDir "daily_pipeline_$timestamp.log"
$resultFile = Join-Path $logDir "latest_result.txt"

# Clear any stale result from a previous run so a crash before step 10 doesn't show yesterday's
# message as if it were today's.
if (Test-Path $resultFile) { Remove-Item $resultFile -Force }

# Load CLAUDE_CODE_OAUTH_TOKEN (and nothing else) from .env without a full dotenv dependency.
$envFile = Join-Path $repoRoot ".env"
foreach ($line in Get-Content $envFile) {
    if ($line -match '^\s*CLAUDE_CODE_OAUTH_TOKEN\s*=\s*(.+)\s*$') {
        $env:CLAUDE_CODE_OAUTH_TOKEN = $matches[1]
    }
}
if (-not $env:CLAUDE_CODE_OAUTH_TOKEN) {
    "CLAUDE_CODE_OAUTH_TOKEN not found in .env -- aborting before even trying to run." | Out-File -FilePath $logFile -Encoding utf8
    exit 1
}

$promptPath = Join-Path $repoRoot "automation\daily_pipeline_prompt.md"

# Use the real .exe, not the claude.cmd npm shim -- ruled out as the cause of the blank-window
# issue (same symptom persisted after switching), but keeping the direct .exe call regardless
# since it's still one less hop.
$claudeExe = "C:\Users\Vinay\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe"

# Stdin note, 2026-08-11: `Get-Content -Raw | & $claudeExe -p ...` (PowerShell's pipe operator
# into a native .exe) hung with zero output every time -- PowerShell's `|` doesn't reliably
# signal end-of-input to a native process the way a real file handle does. Fixed by redirecting
# stdin FROM the prompt file directly instead.
#
# Live-visibility note, 2026-08-11, direct instruction ("don't keep it invisible, I want to see
# progress happening"): stdout/stderr are still redirected to files (needed for a reliable
# after-the-fact log), but this script now actively tails those files while the process runs and
# prints new content straight into ITS OWN console window -- which Task Scheduler launches
# visibly (no -WindowStyle Hidden). This is plain PowerShell text output, not the child .exe's
# own console rendering, so it doesn't depend on however claude.exe's TUI behaves when launched
# without a real attached terminal.

"=== ThatAIPM daily pipeline run: $timestamp ===" | Out-File -FilePath $logFile -Encoding utf8
Write-Output "Starting run $timestamp -- watching for output below..."

$stdoutLog = Join-Path $logDir "daily_pipeline_${timestamp}_stdout.log"
$stderrLog = Join-Path $logDir "daily_pipeline_${timestamp}_stderr.log"
New-Item -ItemType File -Force -Path $stdoutLog | Out-Null
New-Item -ItemType File -Force -Path $stderrLog | Out-Null

$argList = @(
    "-p",
    "--permission-mode", "auto",
    "--allowedTools", "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Skill",
    "--output-format", "text"
)

$proc = Start-Process -FilePath $claudeExe -ArgumentList $argList `
    -RedirectStandardInput $promptPath `
    -RedirectStandardOutput $stdoutLog `
    -RedirectStandardError $stderrLog `
    -NoNewWindow -PassThru -WorkingDirectory $repoRoot

# Tail both files live: print new bytes as they appear, so the visible parent window actually
# shows progress instead of sitting blank until the whole run finishes.
$stdoutPos = 0
$stderrPos = 0
while (-not $proc.HasExited) {
    Start-Sleep -Seconds 2
    $stdoutContent = Get-Content $stdoutLog -Raw -ErrorAction SilentlyContinue
    if ($stdoutContent -and $stdoutContent.Length -gt $stdoutPos) {
        Write-Output $stdoutContent.Substring($stdoutPos)
        $stdoutPos = $stdoutContent.Length
    }
    $stderrContent = Get-Content $stderrLog -Raw -ErrorAction SilentlyContinue
    if ($stderrContent -and $stderrContent.Length -gt $stderrPos) {
        Write-Output "[stderr] $($stderrContent.Substring($stderrPos))"
        $stderrPos = $stderrContent.Length
    }
}
$proc.WaitForExit()
# Final flush in case output landed between the last poll and process exit.
$stdoutContent = Get-Content $stdoutLog -Raw -ErrorAction SilentlyContinue
if ($stdoutContent -and $stdoutContent.Length -gt $stdoutPos) { Write-Output $stdoutContent.Substring($stdoutPos) }
$stderrContent = Get-Content $stderrLog -Raw -ErrorAction SilentlyContinue
if ($stderrContent -and $stderrContent.Length -gt $stderrPos) { Write-Output "[stderr] $($stderrContent.Substring($stderrPos))" }

$exitCode = $proc.ExitCode

Add-Content -Path $logFile -Value "--- stdout ---"
if (Test-Path $stdoutLog) { Get-Content $stdoutLog | Add-Content -Path $logFile }
Add-Content -Path $logFile -Value "--- stderr ---"
if (Test-Path $stderrLog) { Get-Content $stderrLog | Add-Content -Path $logFile }

"=== Run finished, exit code $exitCode ===" | Out-File -FilePath $logFile -Append -Encoding utf8
Write-Output "=== Run finished, exit code $exitCode ==="

# Notify: prefer the one-line result the run itself wrote; fall back to a generic message if it
# crashed before reaching that step (exit code or missing file both count as "something's wrong,
# go check the log" rather than staying silent).
if (Test-Path $resultFile) {
    $message = (Get-Content $resultFile -Raw).Trim()
} else {
    $message = "Daily pipeline run finished with no result written (exit code $exitCode) -- check automation/logs/daily_pipeline_$timestamp.log"
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = [System.Drawing.SystemIcons]::Information
$notify.Visible = $true
$notify.BalloonTipTitle = "ThatAIPM Daily Pipeline"
$notify.BalloonTipText = $message
$notify.ShowBalloonTip(20000)
Start-Sleep -Seconds 21
$notify.Dispose()
