# Implementation Plan - Light/Dark Mode Support

Add a theme switching capability to RentFlow, allowing users to toggle between the premium "Night Mode" and a new "Light Mode".

## Proposed Changes

### [NEW] Expenses Report Module
- **Backend Router**: Add `/api/reports/expenses` to `app/routers/reports.py` to filter expenses by month/year.
- **Backend Schema**: Add `ExpenseReport` and `ExpenseReportItem` to `app/schemas.py`.
- **Frontend UI**: Add a third tab "Expenses Report" to the Reports page.
- **Frontend Logic**: Implement `renderExpensesReport()` in `app.js` to fetch and display expense data.

### [NEW] Universal PDF Export
- **Library**: Add `html2pdf.js` to `index.html`.
- **UI**: Add an "Export to PDF" button to the topbar actions of the Reports page.
- **Logic**: Implement `exportToPDF()` in `app.js`. This function will target the `#pageContent` area and generate a premium-styled PDF while applying any necessary temporary styles to optimize for paper (e.g., hiding action buttons).

### [NEW] GitHub Repository Setup
- Create `.gitignore` to protect sensitive data.
- Initialize Git repository.
- Link to remote GitHub repository.
- Push code to GitHub.

---

## Verification Plan
1. **Visual Contrast**: Verify all text is readable in both modes.
2. **Persistence**: Ensure the theme remains the same after page refresh.
3. **Responsive**: Verify the toggle works on mobile devices.

### [MODIFY] [style.css](file:///c:/Users/Ali%20Foural/Desktop/Rent%20System/app/static/style.css)
- Add specific `@media print` rules to ensure tables fit on A4 pages.
- Ensure "Glassmorphism" looks clean in PDF exports (might need to disable blur for PDF generation).

### [MODIFY] [index.html](file:///c:/Users/Ali%20Foural/Desktop/Rent%20System/app/static/index.html)
- Add a theme toggle link in the "Preferences" section of the sidebar.
- Display current theme status with an icon (Moon/Sun).

### [MODIFY] [app.js](file:///c:/Users/Ali%20Foural/Desktop/Rent%20System/app/static/app.js)
- `initTheme()`: Loads user preference from local storage on startup.
- `toggleTheme()`: Switches the `data-theme` attribute on the `<html>` element and updates local storage.
- Update translations for "Light Mode" and "Night Mode".

## Verification Plan
1. **Visual Contrast**: Verify all text is readable in both modes.
2. **Persistence**: Ensure the theme remains the same after page refresh.
3. **Responsive**: Verify the toggle works on mobile devices.
