// src/components/reminders/SnoozeModal.jsx
import React, { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export default function SnoozeModal({ open, onClose, onSubmit }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value) return;
    onSubmit(value); // returns ISO datetime string
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Snooze Reminder"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      }
    >
      <p className="text-gray-600 mb-4">
        Choose a new date & time to snooze this reminder.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Snooze Until"
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </Modal>
  );
}
