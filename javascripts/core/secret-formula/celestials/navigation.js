"use strict";

GameDatabase.celestials.navigation = {
  "teresa-base": {
    visible: () => true,
    complete: () => 1,
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(100, 100),
      ring: {
        rMajor: 78,
        rMinor: 64,
      },
      alwaysShowLegend: true,
      legend: {
        text: "Teresa",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
  },
  "teresa-reality-unlock": {
    visible: () => true,
    complete: () => (Teresa.has(TERESA_UNLOCKS.RUN)
      ? 1 : player.reality.realityMachines.e / Math.log10(TERESA_UNLOCKS.RUN.price)),
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(100, 100),
      ring: {
        rMajor: 32,
        rMinor: 22,
      },
      legend: {
        text: "Reach 1e14 RM",
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: (function() {
      const pathStart = -Math.PI;
      const pathEnd = Math.PI;
      const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(100, 100), -Math.PI, 69, Math.PI, 26);
      const pathPadStart = path.angleFromRadius(64 - 3) - pathStart;
      const pathPadEnd = pathEnd - path.angleFromRadius(34);
      return {
        pathStart,
        pathEnd,
        path,
        pathPadStart,
        pathPadEnd,
      };
    }()),
  },
  "teresa-reality": {
    visible: () => true,
    complete: () => (Teresa.runCompleted ? 1 : 0),
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      symbol: "Ϟ",
      position: new Vector(100, 100),
      ring: {
        rMajor: 16,
      },
      legend: {
        text: "Teresa's Reality",
        angle: -135,
        diagonal: 96,
        horizontal: 16,
      },
    }
  },
  "teresa-pp-shop": {
    visible: () => true,
    complete: () => (Teresa.has(TERESA_UNLOCKS.SHOP)
      ? 1 : Math.log10(Teresa.rmStore) / Math.log10(TERESA_UNLOCKS.SHOP.price)),
    node: {
      completeClass: "c-celestial-nav__test-complete",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(225, 250),
      ring: {
        rMajor: 16,
        rMinor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Perk Point Shop";
          const rm = Teresa.rmStore;
          const cost = TERESA_UNLOCKS.SHOP.price;
          return [
            "Perk Point Shop",
            `Pour ${format(rm, 1)} / ${format(cost, 0)} RM`
          ];
        },
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(100, 100), 78 - 1, new Vector(225, 250), 16 - 1),
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "effarig-shop": {
    visible: () => true,
    complete: () => (Teresa.has(TERESA_UNLOCKS.EFFARIG)
      ? 1 : Math.log10(Teresa.rmStore) / Math.log10(TERESA_UNLOCKS.EFFARIG.price)),
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(300, 0),
      ring: {
        rMajor: 24,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Effarig's Shop";
          const rm = Teresa.rmStore;
          const cost = TERESA_UNLOCKS.EFFARIG.price;
          return [
            "Effarig",
            `Pour ${format(rm, 1)} / ${format(cost, 0)} RM`
          ];
        },
        angle: -135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(100, 100), 78 - 1, new Vector(300, 0), 24 - 1),
      fill: "url(#gradTeresaEffarig",
    }
  },
  "effarig-reality-unlock": {
    visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
    complete: () => (EffarigUnlock.run.isUnlocked 
      ? 1 : Math.log10(player.celestials.effarig.relicShards) / Math.log10(EffarigUnlock.run.cost)),
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(400, 50),
      ring: {
        rMajor: 16,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Unlock Effarig's Reality";
          const rs = player.celestials.effarig.relicShards;
          const cost = EffarigUnlock.run.cost;
          return [
            "Unlock Effarig's Reality",
            `Reach ${format(rs, 1)} / ${format(cost, 0)} Relic Shards`
          ];
        },
        angle: 75,
        diagonal: 40,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(300, 0), 24 - 1, new Vector(400, 50), 16 - 1),
      fill: "#5151ec",
    }
  },
  "effarig-infinity": {
    visible: () => Teresa.has(TERESA_UNLOCKS.EFFARIG),
    complete: () => {
      if (EffarigUnlock.infinity.isUnlocked) return 1;
      if (!Effarig.isRunning) return 0;

      return player.antimatter.log10() / Decimal.MAX_NUMBER.log10();
    },
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      position: new Vector(550, 25),
      ring: {
        rMajor: 60,
        rMinor: 52,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Effarig's Infinity";
          const am = Effarig.isRunning ? player.antimatter : 0;
          return [
            "Effarig's Infinity",
            `Reach ${format(am, 1)} / ${format(Number.MAX_VALUE, 2)} Antimatter inside Effarig's Reality.`
          ];
        },
        angle: -135,
        diagonal: 70,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(400, 50), 16 - 1, new Vector(550, 25), 60 - 1),
      fill: "#5151ec",
    }
  },
  "effarig-eternity": {
    visible: () => EffarigUnlock.infinity.isUnlocked,
    complete: () => {
      if (EffarigUnlock.eternity.isUnlocked) return 1;
      if (!Effarig.isRunning) return 0;

      return player.infinityPoints.log10() / Decimal.MAX_NUMBER.log10();
    },
    node: {
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#7131ec",
      position: new Vector(550, 25),
      ring: {
        rMajor: 40,
        rMinor: 30,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Effarig's Eternity";
          const ip = Effarig.isRunning ? player.infinityPoints : 0;
          return [
            "Effarig's Eternity",
            `Reach ${format(ip, 1)} / ${format(Number.MAX_VALUE, 2)} IP inside Effarig's Reality.`
          ];
        },
        angle: -45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: (function() {
      const pathStart = -Math.PI;
      const pathEnd = 0;
      const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(560, 25), pathStart, 66, pathEnd, 26);
      const pathPadStart = 0;
      const pathPadEnd = pathEnd - path.angleFromRadius(30);
      return {
        pathStart,
        pathEnd,
        path,
        pathPadStart,
        pathPadEnd,
        fill: "#5151ec"
      };
    }())
  },
  "effarig-reality": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => {
      if (EffarigUnlock.reality.isUnlocked) return 1;
      if (!Effarig.isRunning) return 0;

      return player.eternityPoints.log10() / 4000;
    },
    node: {
      alwaysShowLegend: true,
      completeClass: "c-celestial-nav__effarig",
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#A101ec",
      position: new Vector(550, 25),
      ring: {
        rMajor: 20,
        rMinor: 0,
      },
      symbol: "Ϙ",
      legend: {
        text: complete => {
          if (complete >= 1) return "Effarig's Reality";
          const ep = Effarig.isRunning ? player.eternityPoints : 0;
          const goal = new Decimal("1e4000");
          return [
            "Effarig's Reality",
            `Reach ${format(ep, 1)} / ${format(goal, 2)} IP inside Effarig's Reality.`
          ];
        },
        angle: -120,
        diagonal: 82,
        horizontal: 16,
      },
    },
    connector: (function() {
      const pathStart = 0;
      const pathEnd = Math.PI;
      const path = LogarithmicSpiral.fromPolarEndpoints(new Vector(558, 25), pathStart, 26, pathEnd, 24);
      const pathPadStart = 0;
      const pathPadEnd = 0;
      return {
        pathStart,
        pathEnd,
        path,
        pathPadStart,
        pathPadEnd,
        fill: "#5151ec"
      };
    }())
  },
  "enslaved": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => 1,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#ffa337",
      position: new Vector(650, 250),
      ring: {
        rMajor: 80,
        rMinor: 70,
        gapCenterDeg: 15,
        gapDeg: 200,
      },
      alwaysShowLegend: false,
      legend: {
        text: "Enslaved",
        angle: -55,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(550, 25), 40 - 1, new Vector(650, 250), 80 - 1),
      fill: "url(#gradEffarigEnslaved)",
    }
  },
  "enslaved-unlock-glyph-level": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => {
      const glyphs = Glyphs.activeList.concat(Glyphs.inventoryList);
      let bestGlyph = glyphs[0];
      for (const g of glyphs) {
        if (g.level > bestGlyph.level) bestGlyph = g;
      }
      return bestGlyph.level / 5000;
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#ffa337",
      position: new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)),
      ring: {
        rMajor: 24,
        rMinor: 16,
        gapCenterDeg: 40,
        gapDeg: 60,
        gapAngleDeg: 0,
      },
      legend: {
        text: complete => {
          const goal = 5000;
          return ["Reach glyph", `level ${formatInt(complete * goal, 0)}/${formatInt(goal, 0)}`];
        },
        angle: -45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(650 - 74 * Math.sqrt(0.75), 250 - 74 * 0.5),
        new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)))
        .trimEnd(23),
      fill: "#ffa337",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "enslaved-unlock-glyph-rarity": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => {
      const glyphs = Glyphs.activeList.concat(Glyphs.inventoryList);
      let bestGlyph = glyphs[0];
      for (const g of glyphs) {
        if (g.strength > bestGlyph.strength) bestGlyph = g;
      }
      return strengthToRarity(bestGlyph.strength) / 100;
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#ffa337",
      position: new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)),
      ring: {
        rMajor: 24,
        rMinor: 16,
        gapCenterDeg: 220,
        gapDeg: 60,
        gapAngleDeg: 0,
      },
      legend: {
        text: complete => {
          const goal = 100;
          return ["Reach glyph", 
            `rarity of ${formatPercents(complete * goal / 100, 2)}/${formatPercents(goal / 100, 0)}`
          ];
        },
        angle: 135,
        diagonal: 32,
        horizontal: 32,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(650 + 75 * Math.cos(Math.PI / 180 * -60), 250 + 75 * Math.sin(Math.PI / 180 * -60)),
        new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)))
        .trimStart(23).trimEnd(23),
      fill: "#ffa337",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "enslaved-reality": {
    visible: () => EffarigUnlock.eternity.isUnlocked,
    complete: () => {
      if (Enslaved.isCompleted) return 1;
      if (!Enslaved.isRunning) return 0;

      return player.eternityPoints.log10() / 4000;
    },
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      alwaysShowLegend: true,
      fill: "#ffa337",
      position: new Vector(650, 250),
      ring: {
        rMajor: 80,
        rMinor: 70,
        gapCenterDeg: 195,
        gapDeg: 200,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Enslaved Reality";
          const ep = Enslaved.isRunning ? player.eternityPoints : 0;
          const goal = new Decimal("1e4000");
          return [
            "Enslaved Reality",
            `Reach ${format(ep, 1)} / ${format(goal, 2)} IP inside Enslaved Reality.`
          ];
        },
        angle: 45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(650 + 75 * Math.cos(Math.PI / 180 * 120), 250 + 75 * Math.sin(Math.PI / 180 * 120)),
        new Vector(650 + 74 * Math.sqrt(0.75), 250 + 74 * 0.5))
        .trimStart(23),
      fill: "#ffa337",
    }
  },
    "v-unlock-achievement": {
    visible: () => EffarigUnlock.reality.isUnlocked,
    complete: () => {
      if (Achievement(151).isUnlocked) return 1;
      if (NormalDimension(8).amount.gt(0)) return 0;

      return player.galaxies / 800;
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(400, 350 + 50 * Math.sqrt(3)),
      ring: {
        rMajor: 16,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const galaxies = NormalDimension(8).amount.eq(0) ? player.galaxies : 0;
          const goal = 800;
          return [
            "V's achievement",
            `Reach ${formatInt(galaxies, 1)} / ${formatInt(goal, 2)} galaxies without any 8th dimensions.`
          ];
        },
        angle: -135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: LinearPath.connectCircles(new Vector(650, 250), 80 - 1, new Vector(400, 350 + 50 * Math.sqrt(3)), 16 - 1),
      fill: "url(#gradEffarigV",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-unlock-1": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.realities / GameDatabase.celestials.v.mainUnlock.realities;
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(450, 350),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete === 1) return "Reality condition for V";
          const realities = player.realities;
          const goal = GameDatabase.celestials.v.mainUnlock.realities;
          return [
            "V",
            `Reach ${format(realities, 1)} / ${format(goal, 2)} realities.`
          ];
        },
        angle: -135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(450, 350)),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-unlock-2": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.eternities.log10() / Math.log10(GameDatabase.celestials.v.mainUnlock.eternities);
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(500, 350 + 50 * Math.sqrt(3)),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Eternity condition for V";
          const eternities = player.eternities;
          const goal = GameDatabase.celestials.v.mainUnlock.eternities;
          return [
            "V",
            `Reach ${format(eternities, 1)} / ${format(goal, 2)} eternities.`
          ];
        },
        angle: -135,
        diagonal: 30,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(500, 350 + 50 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  
  "v-unlock-3": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.infinitied.log10() / Math.log10(GameDatabase.celestials.v.mainUnlock.infinities);
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(450, 350 + 100 * Math.sqrt(3)),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Infinities condition for V";
          const infinities = player.infinities;
          const goal = GameDatabase.celestials.v.mainUnlock.infinities;
          return [
            "V",
            `Reach ${format(infinities, 1)} / ${format(goal, 2)} infinities.`
          ];
        },
        angle: -135,
        diagonal: 45,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(450, 350 + 100 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-unlock-4": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.dilation.dilatedTime.log10() / GameDatabase.celestials.v.mainUnlock.dilatedTime.log10();
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(350, 350 + 100 * Math.sqrt(3)),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "DT condition for V";
          const dilatedTime = player.dilation.dilatedTime;
          const goal = GameDatabase.celestials.v.mainUnlock.dilatedTime;
          return [
            "V",
            `Reach ${format(dilatedTime, 1)} / ${format(goal, 2)} Dilated Time.`
          ];
        },
        angle: -135,
        diagonal: 60,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(350, 350 + 100 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-unlock-5": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.replicanti.amount.log10() / GameDatabase.celestials.v.mainUnlock.replicanti.log10();
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(300, 350 + 50 * Math.sqrt(3)),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "Replicanti condition for V";
          const replicanti = player.replicanti.amount;
          const goal = GameDatabase.celestials.v.mainUnlock.replicanti;
          return [
            "V",
            `Reach ${format(replicanti, 1)} / ${format(goal, 2)} replicanti.`
          ];
        },
        angle: -135,
        diagonal: 75,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(300, 350 + 50 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-unlock-6": {
    visible: () => Achievement(151).isUnlocked,
    complete: () => {
      if (V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK)) return 1;
      return player.reality.realityMachines.log10() / Math.log10(GameDatabase.celestials.v.mainUnlock.rm);
    },
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(350, 350),
      ring: {
        rMajor: 0,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "RM condition for V";
          const rm = player.reality.realityMachines;
          const goal = GameDatabase.celestials.v.mainUnlock.rm;
          return [
            "V",
            `Reach ${format(rm, 1)} / ${format(goal, 2)} Reality Machines.`
          ];
        },
        angle: -135,
        diagonal: 90,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(400, 350 + 50 * Math.sqrt(3)),
        new Vector(350, 350)),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },

  "v-achievement-1": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[0] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(450, 350),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[0];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: -45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(350, 350),
        new Vector(450, 350)),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-achievement-2": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[1] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(500, 350 + 50 * Math.sqrt(3)),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[1];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: -45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(450, 350),
        new Vector(500, 350 + 50 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-achievement-3": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[2] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(450, 350 + 100 * Math.sqrt(3)),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[2];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: 45,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(500, 350 + 50 * Math.sqrt(3)),
        new Vector(450, 350 + 100 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-achievement-4": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[3] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(350, 350 + 100 * Math.sqrt(3)),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[3];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(450, 350 + 100 * Math.sqrt(3)),
        new Vector(350, 350 + 100 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-achievement-5": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[4] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(300, 350 + 50 * Math.sqrt(3)),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[4];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: 135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(350, 350 + 100 * Math.sqrt(3)),
        new Vector(300, 350 + 50 * Math.sqrt(3))),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
  "v-achievement-6": {
    visible: () => V.has(V_UNLOCKS.V_ACHIEVEMENT_UNLOCK) || true,
    complete: () => player.celestials.v.runUnlocks[5] / 6,
    drawOrder: -1,
    node: {
      incompleteClass: "c-celestial-nav__test-incomplete",
      fill: "#6ef36e",
      position: new Vector(350, 350),
      ring: {
        rMajor: 8,
      },
      legend: {
        text: complete => {
          if (complete >= 1) return "V's Achievement";
          const completions = player.celestials.v.runUnlocks[5];
          return [
            "V's achievement",
            `Reach ${completions} / 6 completions in .`
          ];
        },
        angle: -135,
        diagonal: 16,
        horizontal: 16,
      },
    },
    connector: {
      pathStart: 0,
      pathEnd: 1,
      path: new LinearPath(
        new Vector(300, 350 + 50 * Math.sqrt(3)),
        new Vector(350, 350)),
      fill: "#6ef36e",
      completeWidth: 6,
      incompleteWidth: 4,
    }
  },
};