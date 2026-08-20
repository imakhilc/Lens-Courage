import challenges from '../seed/challenges.json';

describe('Phase 1 challenge catalog', () => {
  it('contains one ordered path of 30 active challenges', () => {
    expect(challenges).toHaveLength(30);
    expect(challenges.map(challenge => challenge.order)).toEqual(
      Array.from({length: 30}, (_, index) => index + 1),
    );
    expect(challenges.every(challenge => challenge.active)).toBe(true);
  });

  it('marks the required boss challenges', () => {
    expect(challenges.filter(challenge => challenge.boss).map(challenge => challenge.order))
      .toEqual([7, 14, 21, 30]);
  });
});
