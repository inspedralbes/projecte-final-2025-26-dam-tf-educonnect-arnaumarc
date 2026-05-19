# Implementation Tasks

- [x] Task 1: Update Resource creation logic in `CourseDetailsView.tsx`. Find the "Tarea / Ejercicio" button and update its `onClick` handler to set `requiresSubmission: true`. Update the "Material / Teoría" button to set `requiresSubmission: false`.
- [x] Task 2: Update Event creation initial state in `CourseDetailsView.tsx`. Change `newEvent`'s `requiresSubmission` default value from `false` to `true`.
- [x] Task 3: Update Event `<select>` logic in `CourseDetailsView.tsx`. Update the `type` and `modality` `onChange` handlers to dynamically compute and set `requiresSubmission` based on whether it is a digital activity or exam.
