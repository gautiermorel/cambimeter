<template>
  <div class="max-w-xl mx-auto p-6 space-y-6 text-sm">
    <h1 class="text-xl font-bold">Cambio Info - Prix</h1>

    <div class="grid gap-4 grid-cols-2">
      <div>
        <label class="block mb-1 font-medium">Plan</label>
        <select v-model="plan" class="w-full p-2 border rounded">
          <option disabled value="">Choisir un plan</option>
          <option value="start">Start</option>
          <option value="bonus">Bonus</option>
          <option value="comfort">Confort</option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Catégorie</label>
        <select v-model="category" class="w-full p-2 border rounded">
          <option disabled value="">Choisir une catégorie</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-medium">Début</label>
        <input
          type="datetime-local"
          v-model="startTime"
          @change="handleStartChange"
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Fin</label>
        <input
          type="datetime-local"
          v-model="endTime"
          class="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Kilométrage</label>
        <input
          type="number"
          min="0"
          v-model.number="kms"
          class="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium">Tarifs</label>
        <select v-model="rate" class="w-full p-2 border rounded">
          <option disabled value="">Choisir une grille de tarifs</option>
          <option value="2022-10">2022-10</option>
          <option value="2023-10">2023-10</option>
          <option value="2024-03">2024-03</option>
          <option value="2025-03">2025-03</option>
        </select>
      </div>
    </div>

    <div class="mt-4">
      <div class="font-medium">Durée :</div>
      <div>{{ durationDisplay }}</div>
    </div>

    <div class="mt-2">
      <div class="font-medium">Prix :</div>
      <div v-if="price !== null" class="text-green-600 font-semibold">
        {{ price.toFixed(2) }} €
      </div>
      <div v-else class="text-gray-500">Pas assez d'info</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { DateTime, Interval } from "luxon";

const plan = ref("bonus");
const category = ref("M");
const rate = ref("2025-03");
const now = DateTime.now()
  .startOf("hour")
  .plus({ hours: 1 })
  .toISO({ suppressMilliseconds: true, includeOffset: false })
  .slice(0, 16);
const startTime = ref(now);
const endInit = DateTime.fromISO(now)
  .plus({ hours: 1 })
  .toISO({ suppressMilliseconds: true, includeOffset: false })
  .slice(0, 16);
const endTime = ref(endInit);
const kms = ref(1);

const pricing = {
  "2022-10": {
    start: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.2,
        daily: 25.5,
        weekly: 154,
        perKm: {
          "0-100": 0.38,
          "101+": 0.26,
        },
      },
      M: {
        hourly: 2.8,
        daily: 33,
        weekly: 198,
        perKm: {
          "0-100": 0.39,
          "101+": 0.27,
        },
      },
      L: {
        hourly: 3.4,
        daily: 40,
        weekly: 242,
        perKm: {
          "0-100": 0.41,
          "101+": 0.27,
        },
      },
      XL: {
        hourly: 4.6,
        daily: 46,
        weekly: 275,
        perKm: {
          "0-100": 0.46,
          "101+": 0.31,
        },
      },
    },
    bonus: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.95,
        daily: 23,
        weekly: 138,
        perKm: {
          "0-100": 0.29,
          "101+": 0.25,
        },
      },
      M: {
        hourly: 2.3,
        daily: 27.5,
        weekly: 160,
        perKm: {
          "0-100": 0.3,
          "101+": 0.26,
        },
      },
      L: {
        hourly: 2.7,
        daily: 32,
        weekly: 187,
        perKm: {
          "0-100": 0.36,
          "101+": 0.26,
        },
      },
      XL: {
        hourly: 3.9,
        daily: 38.5,
        weekly: 231,
        perKm: {
          "0-100": 0.41,
          "101+": 0.3,
        },
      },
    },
    comfort: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.7,
        daily: 19.5,
        weekly: 116,
        perKm: {
          "0-100": 0.26,
          "101+": 0.21,
        },
      },
      M: {
        hourly: 2.1,
        daily: 24,
        weekly: 145,
        perKm: {
          "0-100": 0.27,
          "101+": 0.22,
        },
      },
      L: {
        hourly: 2.4,
        daily: 28,
        weekly: 174,
        perKm: {
          "0-100": 0.28,
          "101+": 0.22,
        },
      },
      XL: {
        hourly: 3.1,
        daily: 31.5,
        weekly: 187,
        perKm: {
          "0-100": 0.34,
          "101+": 0.26,
        },
      },
    },
  },
  "2023-10": {
    start: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.2,
        daily: 25.5,
        weekly: 154,
        perKm: {
          "0-100": 0.38,
          "101+": 0.26,
        },
      },
      M: {
        hourly: 2.8,
        daily: 33,
        weekly: 198,
        perKm: {
          "0-100": 0.39,
          "101+": 0.27,
        },
      },
      L: {
        hourly: 3.4,
        daily: 40,
        weekly: 242,
        perKm: {
          "0-100": 0.41,
          "101+": 0.27,
        },
      },
      XL: {
        hourly: 4.6,
        daily: 46,
        weekly: 275,
        perKm: {
          "0-100": 0.46,
          "101+": 0.31,
        },
      },
    },
    bonus: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.95,
        daily: 23,
        weekly: 138,
        perKm: {
          "0-100": 0.29,
          "101+": 0.25,
        },
      },
      M: {
        hourly: 2.3,
        daily: 27.5,
        weekly: 160,
        perKm: {
          "0-100": 0.3,
          "101+": 0.26,
        },
      },
      L: {
        hourly: 2.7,
        daily: 32,
        weekly: 187,
        perKm: {
          "0-100": 0.36,
          "101+": 0.26,
        },
      },
      XL: {
        hourly: 3.9,
        daily: 38.5,
        weekly: 231,
        perKm: {
          "0-100": 0.41,
          "101+": 0.3,
        },
      },
    },
    comfort: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.7,
        daily: 19.5,
        weekly: 116,
        perKm: {
          "0-100": 0.26,
          "101+": 0.21,
        },
      },
      M: {
        hourly: 2.1,
        daily: 24,
        weekly: 145,
        perKm: {
          "0-100": 0.27,
          "101+": 0.22,
        },
      },
      L: {
        hourly: 2.4,
        daily: 29,
        weekly: 174,
        perKm: {
          "0-100": 0.28,
          "101+": 0.22,
        },
      },
      XL: {
        hourly: 3.1,
        daily: 31.5,
        weekly: 187,
        perKm: {
          "0-100": 0.34,
          "101+": 0.26,
        },
      },
    },
  },
  "2024-03": {
    start: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.3,
        daily: 26.5,
        weekly: 159,
        perKm: {
          "0-100": 0.39,
          "101+": 0.27,
        },
      },
      M: {
        hourly: 2.9,
        daily: 33.5,
        weekly: 201,
        perKm: {
          "0-100": 0.4,
          "101+": 0.28,
        },
      },
      L: {
        hourly: 3.5,
        daily: 40,
        weekly: 240,
        perKm: {
          "0-100": 0.42,
          "101+": 0.28,
        },
      },
      XL: {
        hourly: 4.7,
        daily: 54,
        weekly: 324,
        perKm: {
          "0-100": 0.47,
          "101+": 0.32,
        },
      },
    },
    bonus: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.05,
        daily: 23.5,
        weekly: 141,
        perKm: {
          "0-100": 0.3,
          "101+": 0.26,
        },
      },
      M: {
        hourly: 2.4,
        daily: 27.5,
        weekly: 165,
        perKm: {
          "0-100": 0.31,
          "101+": 0.27,
        },
      },
      L: {
        hourly: 2.8,
        daily: 32,
        weekly: 192,
        perKm: {
          "0-100": 0.37,
          "101+": 0.27,
        },
      },
      XL: {
        hourly: 4.0,
        daily: 46,
        weekly: 276,
        perKm: {
          "0-100": 0.42,
          "101+": 0.31,
        },
      },
    },
    comfort: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.8,
        daily: 20.5,
        weekly: 123,
        perKm: {
          "0-100": 0.27,
          "101+": 0.22,
        },
      },
      M: {
        hourly: 2.2,
        daily: 25.5,
        weekly: 153,
        perKm: {
          "0-100": 0.28,
          "101+": 0.23,
        },
      },
      L: {
        hourly: 2.5,
        daily: 29,
        weekly: 174,
        perKm: {
          "0-100": 0.29,
          "101+": 0.23,
        },
      },
      XL: {
        hourly: 3.2,
        daily: 37,
        weekly: 222,
        perKm: {
          "0-100": 0.35,
          "101+": 0.27,
        },
      },
    },
  },
  "2025-03": {
    start: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.35,
        daily: 28,
        weekly: 168,
        perKm: {
          "0-100": 0.39,
          "101+": 0.28,
        },
      },
      M: {
        hourly: 2.95,
        daily: 35.5,
        weekly: 213,
        perKm: {
          "0-100": 0.4,
          "101+": 0.29,
        },
      },
      L: {
        hourly: 3.5,
        daily: 40,
        weekly: 240,
        perKm: {
          "0-100": 0.41,
          "101+": 0.3,
        },
      },
      XL: {
        hourly: 4.8,
        daily: 58,
        weekly: 348,
        perKm: {
          "0-100": 0.47,
          "101+": 0.33,
        },
      },
    },
    bonus: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 2.1,
        daily: 25,
        weekly: 150,
        perKm: {
          "0-100": 0.3,
          "101+": 0.27,
        },
      },
      M: {
        hourly: 2.45,
        daily: 29.5,
        weekly: 177,
        perKm: {
          "0-100": 0.31,
          "101+": 0.28,
        },
      },
      L: {
        hourly: 2.8,
        daily: 32,
        weekly: 192,
        perKm: {
          "0-100": 0.35,
          "101+": 0.29,
        },
      },
      XL: {
        hourly: 4.1,
        daily: 49.5,
        weekly: 297,
        perKm: {
          "0-100": 0.42,
          "101+": 0.32,
        },
      },
    },
    comfort: {
      XS: {
        hourly: 3.5,
      },
      S: {
        hourly: 1.85,
        daily: 22,
        weekly: 132,
        perKm: {
          "0-100": 0.27,
          "101+": 0.23,
        },
      },
      M: {
        hourly: 2.25,
        daily: 27,
        weekly: 162,
        perKm: {
          "0-100": 0.28,
          "101+": 0.24,
        },
      },
      L: {
        hourly: 2.5,
        daily: 29,
        weekly: 174,
        perKm: {
          "0-100": 0.29,
          "101+": 0.25,
        },
      },
      XL: {
        hourly: 3.3,
        daily: 40,
        weekly: 240,
        perKm: {
          "0-100": 0.35,
          "101+": 0.29,
        },
      },
    },
  },
};

function handleStartChange() {
  if (startTime.value && !endTime.value) {
    const dt = DateTime.fromISO(startTime.value).plus({ hours: 1 });
    endTime.value = dt
      .toISO({ suppressMilliseconds: true, includeOffset: false })
      .slice(0, 16);
  }
}

const durationMinutes = computed(() => {
  if (!startTime.value || !endTime.value) return 0;
  const start = DateTime.fromISO(startTime.value);
  const end = DateTime.fromISO(endTime.value);
  return Math.max(end.diff(start, "minutes").minutes, 0);
});

const durationDisplay = computed(() => {
  const start = DateTime.fromISO(startTime.value);
  const end = DateTime.fromISO(endTime.value);
  if (!start.isValid || !end.isValid) return "—";

  const diff = end
    .diff(start, ["weeks", "days", "hours", "minutes"])
    .toObject();
  const parts = [];
  if (diff.weeks) parts.push(`${Math.floor(diff.weeks)} sem`);
  if (diff.days) parts.push(`${Math.floor(diff.days)} j`);
  if (diff.hours) parts.push(`${Math.floor(diff.hours)} h`);
  if (diff.minutes) parts.push(`${Math.floor(diff.minutes)} min`);

  return parts.length ? parts.join(" ") : "—";
});

const price = computed(() => {
  if (
    !plan.value ||
    !category.value ||
    !startTime.value ||
    !endTime.value ||
    kms.value == null
  ) {
    return null;
  }

  const start = DateTime.fromISO(startTime.value);
  const end = DateTime.fromISO(endTime.value);
  if (!start.isValid || !end.isValid || end <= start) return null;

  const duration = end.diff(start, ["hours"]).hours;
  const durationHours = Math.ceil(duration);
  const days = duration / 24;
  const weeks = days / 7;

  const data = pricing[rate.value][plan.value]?.[category.value];
  if (!data) return null;

  let base = 0;

  if (weeks >= 1 && data.weekly) {
    base = Math.ceil(weeks) * data.weekly;
  } else if (days >= 1 && data.daily) {
    base = Math.ceil(days) * data.daily;
  } else {
    base = durationHours * data.hourly;
  }

  let kmCost = 0;
  if (data.perKm) {
    if (kms.value <= 100) {
      kmCost = kms.value * data.perKm["0-100"];
    } else {
      kmCost =
        100 * data.perKm["0-100"] + (kms.value - 100) * data.perKm["101+"];
    }
  }

  return base + kmCost;
});

watch([plan, category, rate, startTime, endTime, kms], () => {}, {
  immediate: true,
});
</script>
