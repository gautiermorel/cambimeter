import fetchApi from "@/services/http";

export default class GuestService {

  getGuests () {
    return fetchApi().get(`/public/guests`).then(d => d?.data.sort((a, b) => {
      if (a.lastName < b.lastName) { return -1; }
      if (a.lastName > b.lastName) { return 1; }
      return 0;
    }) || [])
  }
}
