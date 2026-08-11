import { Composition } from "remotion";
import { W, H, FPS } from "./theme";
import { HookPreview_ChatUI } from "./HookPreview_ChatUI";
import { Cm1Episode, calculateCm1Metadata } from "./episodes/cm1/Cm1Episode";
import { Tn1Episode, calculateTn1Metadata } from "./episodes/tn1/Tn1Episode";
import { CoverCm1 } from "./covers/CoverCm1";
import { CoverTn1 } from "./covers/CoverTn1";
import { CoverSk1 } from "./covers/CoverSk1";
import { Sk1Episode, calculateSk1Metadata } from "./episodes/sk1/Sk1Episode";
import { CoverSd1 } from "./covers/CoverSd1";
import { Sd1Episode, calculateSd1Metadata } from "./episodes/sd1/Sd1Episode";
import { CoverKarpathySkill } from "./covers/CoverKarpathySkill";
import { KarpathySkillEpisode, calculateKarpathySkillMetadata } from "./episodes/the-karpathy-skill/KarpathySkillEpisode";
import { CoverAiPmPayGap } from "./covers/CoverAiPmPayGap";
import { AiPmPayGapEpisode, calculateAiPmPayGapMetadata } from "./episodes/the-ai-pm-pay-gap/AiPmPayGapEpisode";
import { CoverPmSkills } from "./covers/CoverPmSkills";
import { PmSkillsEpisode, calculatePmSkillsMetadata } from "./episodes/claude-just-got-68-product-management-skills/PmSkillsEpisode";

const ZERO_FRAMES_CM1 = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
  shot6: 0,
  shot7: 0,
  shot8: 0,
  shot9: 0,
};

const ZERO_FRAMES_TN1 = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
  shot6: 0,
  shot7: 0,
  shot8: 0,
};

const ZERO_FRAMES_SK1 = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
};

const ZERO_FRAMES_SD1 = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
};

const ZERO_FRAMES_KARPATHY = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
};

const ZERO_FRAMES_AI_PM_PAY_GAP = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
};

const ZERO_FRAMES_PM_SKILLS = {
  shot1: 0,
  shot2: 0,
  shot3: 0,
  shot4: 0,
  shot5: 0,
};

// Visual direction locked 2026-08-06 (docs/how_ai_works_content_plan.md
// §1): real recognizable UI/hardware elements on pure black, not abstract
// diagrams. HookPreview_ChatUI is kept as the reference composition for
// that decision (not deleted, unlike the four discarded rounds before it).
export const MyComposition = () => {
  return (
    <>
      <Composition
        id="Hook-Preview-F-ChatUI"
        component={HookPreview_ChatUI}
        durationInFrames={120}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="Episode-cm1"
        component={Cm1Episode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_CM1 }}
        calculateMetadata={calculateCm1Metadata}
      />
      <Composition
        id="Episode-tn1"
        component={Tn1Episode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_TN1 }}
        calculateMetadata={calculateTn1Metadata}
      />
      <Composition id="Cover-cm1" component={CoverCm1} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition id="Cover-tn1" component={CoverTn1} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition
        id="Episode-sk1"
        component={Sk1Episode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_SK1 }}
        calculateMetadata={calculateSk1Metadata}
      />
      <Composition id="Cover-sk1" component={CoverSk1} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition
        id="Episode-sd1"
        component={Sd1Episode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_SD1 }}
        calculateMetadata={calculateSd1Metadata}
      />
      <Composition id="Cover-sd1" component={CoverSd1} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition
        id="Episode-the-karpathy-skill"
        component={KarpathySkillEpisode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_KARPATHY }}
        calculateMetadata={calculateKarpathySkillMetadata}
      />
      <Composition id="Cover-the-karpathy-skill" component={CoverKarpathySkill} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition
        id="Episode-the-ai-pm-pay-gap"
        component={AiPmPayGapEpisode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_AI_PM_PAY_GAP }}
        calculateMetadata={calculateAiPmPayGapMetadata}
      />
      <Composition id="Cover-the-ai-pm-pay-gap" component={CoverAiPmPayGap} durationInFrames={90} fps={FPS} width={W} height={H} />
      <Composition
        id="Episode-claude-just-got-68-product-management-skills"
        component={PmSkillsEpisode}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ frames: ZERO_FRAMES_PM_SKILLS }}
        calculateMetadata={calculatePmSkillsMetadata}
      />
      <Composition id="Cover-claude-just-got-68-product-management-skills" component={CoverPmSkills} durationInFrames={90} fps={FPS} width={W} height={H} />
    </>
  );
};
