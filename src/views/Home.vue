<template>
	<div class="card flex justify-content-center">
		<InputNumber v-model="kms" inputId="integeronly" />

		<input type="datetime-local" :v-model="start" :value="start.toFormat('yyyy-MM-dd\'T\'HH:mm')" class="p-inputtext p-component" @input="event => handleInput(event, 'start')">
		<input type="datetime-local" :v-model="end" :value="end.toFormat('yyyy-MM-dd\'T\'HH:mm')" class="p-inputtext p-component" @input="event => handleInput(event, 'end')">

	</div>

	<p>Trajet : {{ kms }} Km(s)</p>
	<p>Durée : {{ duration.weeks }} semaine(s), {{ duration.days }} jour(s), {{duration.dayHours }} heure(s) de jour et {{duration.nightHours }} heure(s) de nuit {{ duration.minutes}} minute(s)</p>
	<p>Estimation : <b>{{ price.toFixed(2) }} €</b></p>

</template>

<script>
import { DateTime } from 'luxon'
import { ref, computed, watch } from "vue";

const subscription = 'Bonus'
const category = 'S'
const pricing = {
	"Start": {
		"S": {
			"rateDayHour": 2.2,
			"rateBelow100Km": 0.37,
			"rateNightHour": 0.5,
			"rateDay": 25.5,
			"rateWeek": 154,
			"rateAbove100Km": 0.25
		},
		"M": {
			"rateDayHour": 2.8,
			"rateNightHour": 0.5,
			"rateBelow100Km": 0.39,
			"rateAbove100Km": 0.26,
			"rateDay": 33,
			"rateWeek": 198
		},
		"L": {
			"rateDayHour": 3.4,
			"rateNightHour": 1,
			"rateBelow100Km": 0.4,
			"rateAbove100Km": 0.26,
			"rateDay": 40,
			"rateWeek": 242
		},
		"XL": {
			"rateDayHour": 4.6,
			"rateNightHour": 1,
			"rateBelow100Km": 0.45,
			"rateAbove100Km": 0.3,
			"rateDay": 46,
			"rateWeek": 275
		}
	},
	"Bonus": {
		"S": {
			"rateDayHour": 1.95,
			"rateBelow100Km": 0.28,
			"rateNightHour": 0.5,
			"rateDay": 23,
			"rateWeek": 138,
			"rateAbove100Km": 0.24
		},
		"M": {
			"rateDayHour": 2.3,
			"rateNightHour": 0.5,
			"rateBelow100Km": 0.29,
			"rateAbove100Km": 0.25,
			"rateDay": 27.5,
			"rateWeek": 160
		},
		"L": {
			"rateDayHour": 2.7,
			"rateNightHour": 1,
			"rateBelow100Km": 0.35,
			"rateAbove100Km": 0.25,
			"rateDay": 32,
			"rateWeek": 187
		},
		"XL": {
			"rateDayHour": 3.9,
			"rateNightHour": 1,
			"rateBelow100Km": 0.4,
			"rateAbove100Km": 0.29,
			"rateDay": 38.5,
			"rateWeek": 231
		}
	},
	"Comfort": {
		"S": {
			"rateDayHour": 1.7,
			"rateBelow100Km": 0.25,
			"rateNightHour": 0.5,
			"rateDay": 19.5,
			"rateWeek": 116,
			"rateAbove100Km": 0.2
		},
		"M": {
			"rateDayHour": 2.1,
			"rateNightHour": 0.5,
			"rateBelow100Km": 0.26,
			"rateAbove100Km": 0.21,
			"rateDay": 24,
			"rateWeek": 145
		},
		"L": {
			"rateDayHour": 2.4,
			"rateNightHour": 1,
			"rateBelow100Km": 0.27,
			"rateAbove100Km": 0.21,
			"rateDay": 29,
			"rateWeek": 174
		},
		"XL": {
			"rateDayHour": 3.1,
			"rateNightHour": 1,
			"rateBelow100Km": 0.33,
			"rateAbove100Km": 0.25,
			"rateDay": 31.5,
			"rateWeek": 187
		}
	}
}

export default {
	setup () {
		const nowPlus1Hour = DateTime.now().startOf('hour').plus({ hour: 1 })
		const start = ref(nowPlus1Hour);
		const end = ref(nowPlus1Hour);
		const kms = ref(0);

		// need to check also if the start date is under the end date, then make the change, otherwise, let it as it.
		watch(start, (newVal) => { end.value = newVal.plus({ hour: 1 }) });

		const handleInput = (event, key) => {
			const { value } = event.target;
			const format = 'yyyy-MM-dd\'T\'HH:mm';
			if (key === 'start') start.value = DateTime.fromFormat(value, format);
			if (key === 'end') end.value = DateTime.fromFormat(value, format);
		};

		const duration = computed(() => {
			if (!start.value || !end.value) return {};

			const startDate = start.value
			const endDate = end.value

			const diff = endDate.diff(startDate, ["weeks", "days", "hours", "minutes"])
			const { weeks, days, hours, minutes } = diff.toObject() || {}


			// Comment savoir si c'est dans la nuit ?
			let hoursBetweenMidnightAnd6AM = 0;

			for (let i = 0; i < hours; i++) {
				const hour = startDate.plus({ hours: i }).hour;

				if (hour >= 0 && hour < 6) {
					hoursBetweenMidnightAnd6AM++;
				}
			}

			const nightHours = hoursBetweenMidnightAnd6AM
			const dayHours = Math.max(0, hours - hoursBetweenMidnightAnd6AM)

			return { weeks, days, nightHours, dayHours, minutes };
		});

		const trip = computed(() => ({
			rateBelow100Km: Math.min(kms.value, 100),
			rateAbove100Km: Math.max(0, kms.value - 100),
			rateWeek: duration.value.weeks,
			rateDay: duration.value.days,
			rateNightHour: duration.value.nightHours,
			rateDayHour: duration.value.dayHours,
		}))

		const formulas = computed(() => Object.entries(trip.value).reduce((price, [key, value], idx, arr) => {
			price.total = price.total + pricing[subscription][category][key] * value;
			price.detail = price.detail += `(${value} ${key} * ${pricing[subscription][category][key]}€) ${arr.length - 1 === idx ? '' : '+ '}`

			return price
		}, { total: 0, detail: '' }))

		const sums = computed(() => Object.entries(trip.value).reduce((price, [key, value]) => {
			price[key] = pricing[subscription][category][key] * value

			return price
		}, { rateBelow100Km: 0, rateAbove100Km: 0, rateWeek: 0, rateDay: 0, rateNightHour: 0, rateDayHour: 0 }))

		const price = computed(() => {
			const { rateBelow100Km, rateAbove100Km, rateWeek, rateDay, rateNightHour, rateDayHour } = sums.value || {}

			return rateBelow100Km + rateAbove100Km + rateWeek + rateDay + Math.min(rateNightHour + rateDayHour, pricing[subscription][category].rateDay)
		})

		return { duration, trip, kms, start, end, subscription, category, price, formulas, handleInput };
	},
};
</script>
