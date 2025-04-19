<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 px-4 py-8"
  >
    <div
      class="max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10 space-y-8"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            src="/favicon.svg"
            alt="Cambimeter Logo"
            class="h-10 w-10 rounded-full shadow"
          />
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-800">
            Cambimeter
          </h1>
        </div>
        <span class="text-sm text-gray-500">Estimation en temps réel</span>
      </div>

      <!-- Form Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Plan -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >📦 Plan</label
          >
          <select
            v-model="plan"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Choisir un plan</option>
            <option value="start">Start</option>
            <option value="bonus">Bonus</option>
            <option value="comfort">Confort</option>
          </select>
        </div>

        <!-- Catégorie -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >🚗 Catégorie</label
          >
          <select
            v-model="category"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Choisir une catégorie</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        <!-- Début -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >🕓 Début</label
          >
          <input
            type="datetime-local"
            v-model="startTime"
            @change="handleStartChange"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Fin -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >🕔 Fin</label
          >
          <input
            type="datetime-local"
            v-model="endTime"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Kilométrage -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >🛣️ Kilométrage</label
          >
          <input
            type="number"
            min="0"
            v-model.number="kms"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Tarifs -->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-700"
            >📅 Grille tarifaire</label
          >
          <select
            v-model="rate"
            class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Choisir une grille</option>
            <option value="2022-10">2022-10</option>
            <option value="2023-10">2023-10</option>
            <option value="2024-03">2024-03</option>
            <option value="2025-03">2025-03</option>
          </select>
        </div>
      </div>

      <!-- Résultats -->
      <div class="space-y-4">
        <!-- Durée -->
        <div>
          <div class="font-medium text-gray-700">⏳ Durée :</div>
          <div class="text-gray-900">{{ durationDisplay }}</div>
        </div>

        <!-- Prix -->
        <div>
          <div class="font-medium text-gray-700">💰 Prix :</div>

          <div v-if="price?.avg" class="cursor-pointer text-center space-y-1">
            <div class="text-2xl font-bold relative group">
              {{ price?.avg }} €
              <span
                v-if="price"
                class="absolute -top-1 -right-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                (min {{ price.min }} € — max {{ price.max }} €)
              </span>
            </div>
            <div class="text-sm text-gray-400">Prix estimé</div>
          </div>

          <div v-else class="text-gray-500 italic">
            Pas assez d'info pour calculer.
          </div>
        </div>

        <div class="pt-4 text-sm text-gray-600 border-t border-gray-200">
          <p class="italic">
            Les prix au kilomètre suivent les prix officiels des carburants et
            sont ajustés à partir du 1er du mois suivant un changement
            tarifaire. Une variation de 0,15 € entraîne un ajustement de 0,01 €
            du prix/km.
          </p>
          <p class="mt-2 italic">
            Cambimeter estime aussi les tarifs avec une variation hypothétique
            de ±30 centimes €.
          </p>
        </div>
      </div>
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

function formatUnit(value, singular, plural) {
  const rounded = Math.floor(value);
  if (!rounded) return null;
  const label = rounded === 1 ? singular : (plural || singular + "s");
  return `${rounded} ${label}`;
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
  if (!start.isValid || !end.isValid || end <= start) return "—";

  const diff = end.diff(start, ["weeks", "days", "hours", "minutes"]).toObject();
  const parts = [];

  const w = formatUnit(diff.weeks ?? 0, "semaine");
  const d = formatUnit(diff.days ?? 0, "jour");
  const h = formatUnit(diff.hours ?? 0, "heure");
  const m = formatUnit(diff.minutes ?? 0, "minute");

  if (w) parts.push(w);
  if (d) parts.push(d);
  if (h) parts.push(h);
  if (m) parts.push(m);

  const totalMinutes = end.diff(start, "minutes").as("minutes");
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  const pad = (n) => n.toString().padStart(2, "0");

  const totalFormatted = `${totalHours}:${pad(minutes)}`;

  return parts.length
    ? `${parts.join(", ")} (${totalFormatted})`
    : `${totalFormatted}`;
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

  const data = pricing[rate.value][plan.value]?.[category.value];
  if (!data) return null;

  const durationHours = Math.ceil(end.diff(start, ["hours"]).hours);
  const hourlyRate = data.hourly;
  const nightlyRate = 0.5;

  let nightHours = 0;
  for (let dt = start.startOf("hour"); dt < end; dt = dt.plus({ hours: 1 })) {
    const hour = dt.hour;
    if (hour >= 0 && hour < 6) {
      nightHours++;
    }
  }

  const dayHours = durationHours - nightHours;
  const mixedHourlyCost = dayHours * hourlyRate + nightHours * nightlyRate;

  const totalDays = end.diff(start, ["days"]).days;
  const totalWeeks = totalDays / 7;

  const dailyCost = data.daily ? Math.ceil(totalDays) * data.daily : Infinity;
  const weeklyCost = data.weekly
    ? Math.ceil(totalWeeks) * data.weekly
    : Infinity;

  const timeCost = Math.min(mixedHourlyCost, dailyCost, weeklyCost);

  let kmCostMin = 0;
  let kmCostAvg = 0;
  let kmCostMax = 0;
  if (data.perKm) {
    if (kms.value <= 100) {
      kmCostMin = kms.value * (data.perKm["0-100"] - 0.02);
      kmCostAvg = kms.value * data.perKm["0-100"];
      kmCostMax = kms.value * (data.perKm["0-100"] + 0.02);
    } else {
      kmCostMin =
        100 * (data.perKm["0-100"] - 0.02) +
        (kms.value - 100) * (data.perKm["101+"] - 0.02);
      kmCostAvg =
        100 * data.perKm["0-100"] + (kms.value - 100) * data.perKm["101+"];
      kmCostMax =
        100 * (data.perKm["0-100"] + 0.02) +
        (kms.value - 100) * (data.perKm["101+"] + 0.02);
    }
  }

  return {
    min: Math.round((timeCost + kmCostMin) * 100) / 100,
    avg: Math.round((timeCost + kmCostAvg) * 100) / 100,
    max: Math.round((timeCost + kmCostMax) * 100) / 100,
  };
});

watch([plan, category, rate, startTime, endTime, kms], () => {}, {
  immediate: true,
});
</script>
