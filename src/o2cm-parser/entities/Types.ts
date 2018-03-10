export enum DivisionTypes {
  Amateur, Combine
}

export enum PointSkillTypes {
  Newcomer, Bronze, Silver, Gold, Novice, PreChamp, Champ
}

export enum EventSkillTypes {
  Newcomer = PointSkillTypes.Newcomer,
  Bronze = PointSkillTypes.Bronze,
  Silver = PointSkillTypes.Silver,
  Gold = PointSkillTypes.Gold,
  Novice = PointSkillTypes.Novice,
  PreChamp = PointSkillTypes.PreChamp,
  Champ = PointSkillTypes.Champ,
  Beginner,
  Intermediate,
  Advanced,
  Syllabus,
  Open
}

export module EventSkillTypes {
  export const toPointSkillType = (skill: EventSkillTypes): PointSkillTypes => {
    switch (skill) {
      case EventSkillTypes.Beginner:
        return PointSkillTypes.Bronze;
      case EventSkillTypes.Intermediate:
        return PointSkillTypes.Silver;
      case EventSkillTypes.Advanced:
        return PointSkillTypes.Gold;
      case EventSkillTypes.Syllabus:
        return PointSkillTypes.Bronze;
      case EventSkillTypes.Open:
        return PointSkillTypes.Novice;
    }
    return <any>skill;
  };
}

export enum AgeTypes {
  Adult
}

export enum StyleTypes {
  Standard = 1,
  Smooth = 2,
  Latin = 4,
  Rhythm = 8
}

export enum DanceTypes {
  Tango, VWaltz, Foxtrot, Waltz, QuickStep, Jive,
  ChaCha, Rumba, Swing, Pasodoble, Bolero, Samba, Mambo
}

export module DanceTypes {
  export const LetterType = {
    T: DanceTypes.Tango,
    V: DanceTypes.VWaltz,
    F: DanceTypes.Foxtrot,
    W: DanceTypes.Waltz,
    Q: DanceTypes.QuickStep,
    J: DanceTypes.Jive,
    C: DanceTypes.ChaCha,
    R: DanceTypes.Rumba,
    B: DanceTypes.Bolero,
    P: DanceTypes.Pasodoble,
    S: DanceTypes.Swing,
    M: DanceTypes.Mambo,
    // S: DanceTypes.Samba TODO:fix it
  };

  const tmp = (<string[]>JSON.parse(JSON.stringify(LetterType)));
  export const toLetter = {};
  Object.keys(tmp).forEach(v => toLetter[tmp[v]] = v);
  toLetter[DanceTypes.Samba] = 'S';


  export function getStyleForOne(dance: DanceTypes) {
    if (dance === DanceTypes.Jive || dance === DanceTypes.ChaCha ||
      dance === DanceTypes.Rumba || dance === DanceTypes.Swing
      || dance === DanceTypes.Pasodoble || dance === DanceTypes.Bolero
      || dance === DanceTypes.Samba || dance === DanceTypes.Mambo) {
      // noinspection TsLint
      return (StyleTypes.Latin | StyleTypes.Rhythm);
    }
    if (dance === DanceTypes.Foxtrot || dance === DanceTypes.Waltz ||
      dance === DanceTypes.QuickStep || dance === DanceTypes.Tango || dance === DanceTypes.VWaltz) {
      // noinspection TsLint
      return (StyleTypes.Smooth | StyleTypes.Standard);
    }
    return null;
  }

  export function getStyle(dances: DanceTypes[]) {
    if (!dances) {
      return null;
    }
    let style: StyleTypes = null;
    for (let i = 0; i < dances.length; i++) {
      if (style == null) {
        style = DanceTypes.getStyleForOne(dances[i]);
      } else if (style !== DanceTypes.getStyleForOne(dances[i])) {
        return null;
      }
    }
    return style;
  }
}

