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

$promptPath = Join-Path $repoRoot "automation\daily_pipeline_prompt.md"
$prompt = Get-Content -Path $promptPath -Raw

$claudeExe = "C:\Users\Vinay\AppData\Roaming\npm\claude.cmd"

"=== ThatAIPM daily pipeline run: $timestamp ===" | Out-File -FilePath $logFile -Encoding utf8

& $claudeExe -p $prompt `
    --permission-mode auto `
    --allowedTools "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch,Skill" `
    --output-format text `
    *>> $logFile

$exitCode = $LASTEXITCODE
"=== Run finished, exit code $exitCode ===" | Out-File -FilePath $logFile -Append -Encoding utf8

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
