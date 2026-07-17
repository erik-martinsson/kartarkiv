"use client";

import type { ChangeEvent } from "react";
import type { RaceFormData } from "@/types/race";

type Props = {
  form: RaceFormData;
  onChange: (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >,
  ) => void;
};

export default function RaceForm({
  form,
  onChange,
}: Props) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <div>
          <p className="step-label">STEG 2</p>
          <h2>Tävlingsinformation</h2>
        </div>

        <span className="panel-note">
          * Obligatoriskt
        </span>
      </div>

      <div className="form-grid">
        <label className="field field-wide">
          <span>Tävling *</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Exempel: Öjetrampen"
            required
          />
        </label>

        <label className="field">
          <span>Datum *</span>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span>Land</span>
          <input
            name="country"
            value={form.country}
            onChange={onChange}
            maxLength={2}
          />
        </label>

        <label className="field field-wide">
          <span>Arrangör *</span>
          <input
            name="club"
            value={form.club}
            onChange={onChange}
            placeholder="Klubb eller arrangör"
            required
          />
        </label>

        <label className="field field-wide">
          <span>Plats *</span>
          <input
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Tävlingsort eller kartområde"
            required
          />
        </label>

        <label className="field">
          <span>Klass *</span>
          <input
            name="raceClass"
            value={form.raceClass}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span>Disciplin *</span>
          <select
            name="discipline"
            value={form.discipline}
            onChange={onChange}
          >
            <option>Lång</option>
            <option>Medel</option>
            <option>Sprint</option>
            <option>Natt</option>
            <option>Stafett</option>
            <option>Ultralång</option>
            <option>Annat</option>
          </select>
        </label>

        <label className="field">
          <span>Banlängd (km) *</span>
          <input
            name="distanceKm"
            type="number"
            min="0"
            step="0.01"
            value={form.distanceKm}
            onChange={onChange}
            placeholder="8.36"
            required
          />
        </label>

        <label className="field">
          <span>Tävlingstid *</span>
          <input
            name="time"
            value={form.time}
            onChange={onChange}
            placeholder="53:37"
            required
          />
        </label>

        <label className="field">
          <span>Placering *</span>
          <input
            name="position"
            type="number"
            min="1"
            value={form.position}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span>Antal startande</span>
          <input
            name="starters"
            type="number"
            min="1"
            value={form.starters}
            onChange={onChange}
          />
        </label>

        <label className="field">
          <span>Kontroller</span>
          <input
            name="controls"
            type="number"
            min="0"
            value={form.controls}
            onChange={onChange}
          />
        </label>

        <label className="field">
          <span>Bomtid</span>
          <input
            name="mistakeTime"
            value={form.mistakeTime}
            onChange={onChange}
            placeholder="0:40"
          />
        </label>

        <label className="field field-wide">
          <span>Livelox-länk</span>
          <input
            name="livelox"
            type="url"
            value={form.livelox}
            onChange={onChange}
            placeholder="https://..."
          />
        </label>

        <label className="field field-wide">
          <span>Winsplits-länk</span>
          <input
            name="winsplits"
            type="url"
            value={form.winsplits}
            onChange={onChange}
            placeholder="https://..."
          />
        </label>

        <label className="field field-wide">
          <span>Resultatlänk</span>
          <input
            name="results"
            type="url"
            value={form.results}
            onChange={onChange}
            placeholder="https://..."
          />
        </label>

        <label className="field field-wide">
          <span>Kommentar</span>
          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            rows={5}
            placeholder="Kort analys eller kommentar om loppet"
          />
        </label>
      </div>
    </section>
  );
}
