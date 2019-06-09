"use strict";

function startChallenge() {
  secondSoftReset();
  if (!Enslaved.isRunning) Tab.dimensions.normal.show();
}

function askChallengeConfirmation(goal) {
  if (!player.options.confirmations.challenges) return true;
  const message = "You will start over with just your infinity upgrades, and achievements. " +
        `You need to reach ${goal} with special conditions. ` +
        "NOTE: The rightmost infinity upgrade column doesn't work on challenges.";
  return confirm(message);
}

function setChallengeTime(id, time) {
  // Use splice so Vue could track changes
  player.challenge.normal.bestTimes.splice(id, 1, time);
  GameCache.challengeTimeSum.invalidate();
  GameCache.worstChallengeTime.invalidate();
}

function setInfChallengeTime(id, time) {
  // Use splice so Vue could track changes
  player.challenge.infinity.bestTimes.splice(id, 1, time);
  GameCache.infinityChallengeTimeSum.invalidate();
}

function tryUnlockInfinityChallenges() {
  while (player.postChallUnlocked < 8 &&
    player.money.gte(InfinityChallenge(player.postChallUnlocked + 1).config.unlockAM)) {
    ++player.postChallUnlocked;
    if (player.eternities > 6) {
      InfinityChallenge(player.postChallUnlocked).complete();
      Autobuyer.tryUnlockAny();
    }
  }
}

function updateNormalAndInfinityChallenges(diff) {
  if (NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning) {
    if (NormalDimension(2).amount.neq(0)) {
      player.matter = player.matter
        .times(Decimal.pow((1.03 + player.resets / 200 + player.galaxies / 100), diff / 100));
    }
    if (player.matter.gt(player.money) && NormalChallenge(11).isRunning) {
      Modal.message.show(`Your ${shorten(player.money, 2, 2)} antimatter was annhiliated by ` +
        `${shorten(player.matter, 2, 2)} matter.`);
      softReset(0);
    }
  }

  if (InfinityChallenge(8).isRunning) postc8Mult = postc8Mult.times(Math.pow(0.000000046416, diff / 100));

  if (NormalChallenge(3).isRunning) {
    player.chall3Pow = player.chall3Pow.times(Decimal.pow(1.00038, diff / 100)).clampMax(Decimal.MAX_NUMBER);
  }

  if (NormalChallenge(2).isRunning) {
    player.chall2Pow = Math.min(player.chall2Pow + diff / 100 / 1800, 1);
  }

  if (InfinityChallenge(2).isRunning) {
    if (postC2Count >= 8 || diff > 8000) {
      if (NormalDimension(8).amount.gt(0)) {
        sacrificeReset();
      }
      postC2Count = 0;
    } else {
      postC2Count++;
    }
  }
}

class NormalChallengeState extends GameMechanicState {
  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get isRunning() {
    const isPartOfIC1 = this.id !== 9 && this.id !== 12;
    return player.challenge.normal.current === this.id || (isPartOfIC1 && InfinityChallenge(1).isRunning);
  }

  start() {
    if (this.id === 1) return;
    if (!askChallengeConfirmation("infinity")) return;

    player.challenge.normal.current = this.id;
    player.challenge.infinity.current = 0;

    if (Enslaved.isRunning && EternityChallenge(6).isRunning && this.id === 10) Enslaved.showEC10C6Hint();

    startChallenge();
  }

  get isCompleted() {
    // eslint-disable-next-line no-bitwise
    return (player.challenge.normal.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    // eslint-disable-next-line no-bitwise
    player.challenge.normal.completedBits |= 1 << this.id;
    Autobuyer.tryUnlockAny();
  }

  get goal() {
    if (Enslaved.isRunning && !Enslaved.IMPOSSIBLE_CHALLENGE_EXEMPTIONS.includes(this.id)) {
      return Decimal.pow10(1e15);
    }
    return Decimal.MAX_NUMBER;
  }

  updateChallengeTime() {
    if (player.challenge.normal.bestTimes[this.id - 2] > player.thisInfinityTime) {
      setChallengeTime(this.id - 2, player.thisInfinityTime);
    }
  }

  exit() {
    player.challenge.normal.current = 0;
    secondSoftReset();
    if (!Enslaved.isRunning) Tab.dimensions.normal.show();
  }
}

GameMechanicState.createIndex(NormalChallengeState, GameDatabase.challenges.normal);

/**
 * @param {number} id
 * @return {NormalChallengeState}
 */
const NormalChallenge = id => NormalChallengeState.index[id];

/**
 * @returns {NormalChallengeState}
 */
Object.defineProperty(NormalChallenge, "current", {
  get: () => (player.challenge.normal.current > 0
    ? NormalChallenge(player.challenge.normal.current)
    : undefined),
});

Object.defineProperty(NormalChallenge, "isRunning", {
  get: () => player.challenge.normal.current !== 0,
});

const NormalChallenges = {
  /**
   * @type {NormalChallengeState[]}
   */
  all: NormalChallengeState.index.compact(),
  /**
   * @returns {NormalChallengeState[]}
   */
  get completed() {
    return NormalChallenges.all.filter(c => c.isCompleted);
  },
  completeAll() {
    for (const challenge of NormalChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.normal.completedBits = 0;
  }
};

class InfinityChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get canBeApplied() {
    return this._challenge.isCompleted;
  }
}

class InfinityChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new InfinityChallengeRewardState(config.reward, this);
  }

  get isUnlocked() {
    return player.postChallUnlocked >= this.id;
  }

  get isRunning() {
    return player.challenge.infinity.current === this.id;
  }

  start() {
    if (!askChallengeConfirmation("a set goal")) return;

    player.challenge.normal.current = 0;
    player.challenge.infinity.current = this.id;

    startChallenge();
    player.break = true;

    if (EternityChallenge.isRunning) Achievement(115).unlock();
  }

  get isCompleted() {
    // eslint-disable-next-line no-bitwise
    return (player.challenge.infinity.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    // eslint-disable-next-line no-bitwise
    player.challenge.infinity.completedBits |= 1 << this.id;
  }

  get canBeApplied() {
    return this.isRunning;
  }

  /**
   * @return {InfinityChallengeRewardState}
   */
  get reward() {
    return this._reward;
  }

  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get goal() {
    return this.config.goal;
  }

  updateChallengeTime() {
    if (player.challenge.infinity.bestTimes[this.id - 1] > player.thisInfinityTime) {
      setInfChallengeTime(this.id - 1, player.thisInfinityTime);
    }
  }

  exit() {
    player.challenge.infinity.current = 0;
    secondSoftReset();
    if (!Enslaved.isRunning) Tab.dimensions.normal.show();
  }
}

GameMechanicState.createIndex(InfinityChallengeState, GameDatabase.challenges.infinity);

/**
 * @param {number} id
 * @return {InfinityChallengeState}
 */
const InfinityChallenge = id => InfinityChallengeState.index[id];

/**
 * @returns {InfinityChallengeState}
 */
Object.defineProperty(InfinityChallenge, "current", {
  get: () => (player.challenge.infinity.current > 0
    ? InfinityChallenge(player.challenge.infinity.current)
    : undefined),
});

Object.defineProperty(InfinityChallenge, "isRunning", {
  get: () => InfinityChallenge.current !== undefined,
});

const InfinityChallenges = {
  /**
   * @type {InfinityChallengeState[]}
   */
  all: InfinityChallengeState.index.compact(),
  completeAll() {
    for (const challenge of InfinityChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.infinity.completedBits = 0;
  },
  /**
   * @returns {InfinityChallengeState[]}
   */
  get completed() {
    return InfinityChallenges.all.filter(ic => ic.isCompleted);
  }
};
