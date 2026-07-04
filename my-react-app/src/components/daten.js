export class Prüfung {
  constructor(name, ects, note, status, datum){
    this.name = name;
    this.ects = ects;
    this.note = note;
    this.status = status;
    this.datum = datum;
  }
}

export const prüfungarray = [
  new Prüfung("Mathematik", 5, 4.0, "bestanden", "2026-09-01"),
  new Prüfung("Informatik", 5, 1.7, "bestanden", "2026-09-15"),
  new Prüfung("Physik", 5, "--", "eingeschrieben", "2027-02-10"),
  new Prüfung("Deutsch", 5, "--", "offen", "2027-02-10")
];