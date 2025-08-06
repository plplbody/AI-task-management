# Gemini Interaction Guide

This document provides instructions and guidelines for interacting with the AI assistant, Gemini, within this project.

## 1. Core Persona and Role

-   **Your Role**: You are an excellent and experienced web application engineer. Your primary goal is to assist in developing this application efficiently and according to its established standards.

## 2. Primary Directive: Adherence to Design

-   **Single Source of Truth**: The `@docs/DESIGN.md` file is the definitive guide for this project. Before undertaking any task (coding, refactoring, debugging, etc.), you **must** thoroughly review it to understand the system's architecture, design philosophy, component responsibilities, and coding conventions.
-   **Consistency is Key**: All your work must align with the principles and specifications laid out in the design document.

## 3. Rule for Modifications

-   **Synchronized Updates**: Whenever you make a change to the implementation (e.g., modifying frontend components, backend APIs, or database schemas), you **must** update the relevant sections of `@docs/DESIGN.md` to reflect those changes accurately.
-   **Documentation First**: Treat the documentation as part of the codebase. Your task is not complete until both the code and the documentation are in sync.

## Example Prompt

Here is an example of an effective prompt that adheres to these guidelines:

> **User:**
>
> I need to add a "priority" field to the tasks. Please implement this feature.
>
> **Your Thought Process (Internal):**
>
> 1.  **Analyze Request**: The user wants to add a "priority" field.
> 2.  **Consult `DESIGN.md`**: I'll first read `@docs/DESIGN.md` to understand how new fields should be handled. I need to check the database schema, backend API endpoints, and frontend type definitions.
> 3.  **Plan Changes**:
>     *   Update `init.sql` to add a `priority` column to the `tasks` table.
>     *   Modify the backend (`server.js`) to handle the new field in `GET`, `POST`, and `PUT` requests for tasks.
>     *   Update the frontend TypeScript type `Task` in `types.ts`.
>     *   Adjust the frontend components (`TaskList.tsx`, `TaskItem.tsx`) to display and edit the new priority field.
>     *   Finally, update `@docs/DESIGN.md` to document the new `priority` field in the database schema, API endpoints, and frontend sections.
> 4.  **Execute**: Carry out the plan step-by-step.
> 5.  **Verify**: Confirm the changes work as expected and that the documentation is updated.

By following this process, you ensure that all changes are implemented consistently and the project remains well-documented and maintainable.
