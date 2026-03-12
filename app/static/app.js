/* ─── RentFlow SPA ─── */

const API = '';

// ─── Utility ──────────────────────────────────────────────────────────────────

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const translations = {
  en: {
    app_name: 'RentFlow',
    app_desc: 'Asset Management',
    nav_overview: 'Overview',
    nav_dashboard: 'Dashboard',
    nav_management: 'Management',
    nav_asset_types: 'Asset Types',
    nav_assets: 'Assets',
    nav_leases: 'Leases',
    nav_payments: 'Revenues',
    btn_new_type: '+ New Type',
    btn_new_asset: '+ New Asset',
    btn_new_lease: '+ New Lease',
    btn_new_payment: '+ New Revenue',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    create: 'Create',
    update: 'Update',
    record: 'Record',
    loading: 'Loading...',
    dashboard_types: 'Asset Types',
    dashboard_total: 'Total Assets',
    dashboard_active: 'Active Leases',
    dashboard_revenue: 'Total Revenue',
    dashboard_pending: 'Pending Balance',
    recent_leases: 'Recent Leases',
    tenant: 'Tenant',
    asset: 'Asset',
    contract: 'Contract',
    paid: 'Paid',
    remaining: 'Remaining',
    start_date: 'Start Date',
    end_date: 'End Date',
    name: 'Name',
    created: 'Created',
    actions: 'Actions',
    type: 'Type',
    base_price: 'Base Price',
    status: 'Status',
    period: 'Period',
    amount: 'Amount',
    method: 'Method',
    date: 'Date',
    nav_reports: 'Reports',
    tab_monthly: 'Monthly Status',
    tab_annual: 'Annual Asset History',
    filter_all: 'All',
    total_rented_assets: 'Rented Assets',
    select_asset: 'Select Asset',
    month: 'Month',
    year: 'Year',
    generate: 'Generate Report',
    paid_status: 'Paid',
    unpaid_status: 'Unpaid',
    partial_status: 'Partial',
    vacant_status: 'Vacant',
    paid_amount: 'Amount Paid',
    asset_name: 'Asset Name',
    tenant_name: 'Tenant Name',
    expected_rent: 'Expected Rent',
    balance: 'Balance',
    phone_number: 'Phone Number',
    notifications: 'Notifications',
    upcoming_dues: 'Upcoming Dues',
    late_payments: 'Late Revenues',
    no_notifications: 'No new notifications',
    whatsapp_msg: 'Message User',
    successful_payments: 'Successful Revenues',
    nav_expenses: 'Expenses',
    btn_new_expense: '+ New Expense',
    item: 'Item',
    notes: 'Notes',
    tab_expenses: 'Expenses Report',
    total_expenses: 'Total Expenses',
    export_pdf: 'Export PDF',
    theme_light: 'Light Mode',
    theme_dark: 'Night Mode',
    theme_toggle: 'Night Mode'
  },
  ar: {
    app_name: 'رنت فلو',
    app_desc: 'إدارة الأصول',
    nav_overview: 'نظرة عامة',
    nav_dashboard: 'لوحة التحكم',
    nav_management: 'الإدارة',
    nav_asset_types: 'أنواع الأصول',
    nav_assets: 'الأصول',
    nav_leases: 'العقود',
    nav_payments: 'الإيرادات',
    btn_new_type: '+ نوع جديد',
    btn_new_asset: '+ أصل جديد',
    btn_new_lease: '+ عقد جديد',
    btn_new_payment: '+ إيراد جديد',
    edit: 'تعديل',
    delete: 'حذف',
    cancel: 'إلغاء',
    create: 'إنشاء',
    update: 'تحديث',
    record: 'تسجيل',
    loading: 'جاري التحميل...',
    dashboard_types: 'أنواع الأصول',
    dashboard_total: 'إجمالي الأصول',
    dashboard_active: 'العقود النشطة',
    dashboard_revenue: 'إجمالي الإيرادات',
    dashboard_pending: 'الرصيد المعلق',
    recent_leases: 'أحدث العقود',
    tenant: 'المستأجر',
    asset: 'الأصل',
    contract: 'العقد',
    paid: 'المدفوع',
    remaining: 'المتبقي',
    start_date: 'تاريخ البدء',
    end_date: 'تاريخ الانتهاء',
    name: 'الاسم',
    created: 'تاريخ الإنشاء',
    actions: 'الإجراءات',
    type: 'النوع',
    base_price: 'السعر الأساسي',
    status: 'الحالة',
    period: 'المدة',
    amount: 'المبلغ',
    method: 'طريقة الدفع',
    date: 'التاريخ',
    nav_reports: 'التقارير',
    tab_monthly: 'التقارير الديناميكية',
    tab_annual: 'السجل السنوي للأصل',
    filter_all: 'الكل',
    total_rented_assets: 'الأصول المؤجرة',
    select_asset: 'اختر الأصل',
    month: 'الشهر',
    year: 'السنة',
    generate: 'توليد التقرير',
    paid_status: 'مدفوع',
    unpaid_status: 'غير مدفوع',
    partial_status: 'جزئي',
    vacant_status: 'شاغر',
    paid_amount: 'المبلغ المدفوع',
    asset_name: 'اسم الأصل',
    tenant_name: 'اسم المستأجر',
    expected_rent: 'الإيجار المتوقع',
    balance: 'الرصيد',
    phone_number: 'رقم الهاتف',
    notifications: 'التنبيهات',
    upcoming_dues: 'مستحقات قادمة',
    late_payments: 'إيرادات متأخرة',
    no_notifications: 'لا توجد تنبيهات جديدة',
    whatsapp_msg: 'مراسلة عبر واتساب',
    successful_payments: 'الإيرادات الناجحة',
    nav_expenses: 'المصروفات',
    btn_new_expense: '+ مصروف جديد',
    item: 'البند',
    notes: 'ملاحظات',
    tab_expenses: 'تقرير المصروفات',
    total_expenses: 'إجمالي المصروفات',
    export_pdf: 'تصدير PDF',
    theme_light: 'الوضع النهاري',
    theme_dark: 'الوضع الليلي',
    theme_toggle: 'الوضع الليلي'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return translations[currentLang][key] || key;
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('lang', currentLang);
  document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.lang = currentLang;
  
  // Update static DOM
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  
  // Re-render current page
  navigate(currentPage);
}

// ─── Mobile Sidebar ───
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function closeModal() {
  document.querySelector('.modal-overlay')?.remove();
}

// ─── Notifications ────────────────────────────────────────────────────────────
async function loadNotifications() {
  try {
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notificationBadge');
    if (!list || !badge) return;

    // Build UI Translation for header
    const header = document.querySelector('.notification-header');
    if (header) header.textContent = t('notifications');

    const notifs = await api('/api/notifications');
    const overdueCount = notifs.filter(n => n.type === 'Overdue').length;

    if (overdueCount > 0) {
      badge.style.display = 'block';
      badge.textContent = overdueCount;
    } else {
      badge.style.display = 'none';
      badge.textContent = '0';
    }

    if (!notifs.length) {
      list.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">${t('no_notifications')}</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => {
      const isOverdue = n.type === 'Overdue';
      return `
        <div class="notification-item ${isOverdue ? 'overdue' : 'upcoming'}">
          <div style="font-weight:600;margin-bottom:4px;color:${isOverdue ? 'var(--red)' : 'var(--yellow)'}">
            ${isOverdue ? t('late_payments') : t('upcoming_dues')}
          </div>
          <div>${n.asset_name} - ${n.tenant_name}</div>
          <div class="notification-meta">${n.message}</div>
          ${n.phone_number ? `<a href="https://wa.me/${n.phone_number}" target="_blank" style="display:inline-block;margin-top:6px;font-size:11px;color:var(--green);text-decoration:none;">💬 ${t('whatsapp_msg')}</a>` : ''}
        </div>
      `;
    }).join('');
  } catch(e) { console.error('Failed to load notifications', e); }
}

window.toggleNotifications = function() {
  document.getElementById('notificationDropdown').classList.toggle('open');
}

// Close dropdown if clicked outside
document.addEventListener('click', (e) => {
  const container = document.querySelector('.notification-container');
  if (container && !container.contains(e.target)) {
    document.getElementById('notificationDropdown').classList.remove('open');
  }
});

// Load notifications periodically
setInterval(loadNotifications, 60000);
setTimeout(loadNotifications, 500);

// ─── Navigation ───────────────────────────────────────────────────────────────

let currentPage = 'dashboard';

function navigate(page) {
  currentPage = page;
  closeSidebar();
  
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  const titles = {
    'dashboard': t('nav_dashboard'),
    'asset-types': t('nav_asset_types'),
    'assets': t('nav_assets'),
    'leases': t('nav_leases'),
    'payments': t('nav_payments'),
    'expenses': t('nav_expenses'),
    'reports': t('nav_reports'),
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  renderPage(page);
}

async function renderPage(page) {
  const content = document.getElementById('pageContent');
  const actions = document.getElementById('topbarActions');
  actions.innerHTML = '';
  content.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted)">Loading...</div>';

  try {
    switch (page) {
      case 'dashboard': await renderDashboard(content, actions); break;
      case 'asset-types': await renderAssetTypes(content, actions); break;
      case 'assets': await renderAssets(content, actions); break;
      case 'leases': await renderLeases(content, actions); break;
      case 'payments': await renderPayments(content, actions); break;
      case 'expenses': await renderExpenses(content, actions); break;
      case 'reports': await renderReports(content, actions); break;
    }
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Error: ${e.message}</p></div>`;
  }
}

// ─── Reports ─────────────────────────────────────────────────────────────

let currentReportTab = 'monthly';
let monthlyReportData = [];

async function renderReports(el, actions) {
  actions.innerHTML = '';
  el.innerHTML = `
    <div class="tabs">
      <button class="tab-btn ${currentReportTab === 'monthly' ? 'active' : ''}" onclick="switchReportTab('monthly')">${t('tab_monthly')}</button>
      <button class="tab-btn ${currentReportTab === 'annual' ? 'active' : ''}" onclick="switchReportTab('annual')">${t('tab_annual')}</button>
      <button class="tab-btn ${currentReportTab === 'expenses' ? 'active' : ''}" onclick="switchReportTab('expenses')">${t('tab_expenses')}</button>
    </div>
    <div id="reportFilters" class="report-filter-bar"></div>
    <div id="reportTabContent"></div>
  `;
  const filterContainer = document.getElementById('reportFilters');
  if (currentReportTab === 'monthly') await renderMonthlyTab(filterContainer);
  else if (currentReportTab === 'annual') await renderAnnualTab(filterContainer);
  else await renderExpensesTab(filterContainer);

  actions.innerHTML = `<button class="btn btn-secondary" onclick="exportToPDF()"><span class="icon">📄</span> ${t('export_pdf')}</button>`;
}

window.switchReportTab = function(tab) {
  currentReportTab = tab;
  navigate('reports');
}

async function renderMonthlyTab(container) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

  container.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; width: 100%; margin-bottom: 24px;">
      <div class="datepicker-wrap" style="flex:1; min-width: 140px;">
        <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
        <input type="date" id="reportFrom" class="form-control with-icon native-date" value="${firstDay}" style="height:42px;">
      </div>
      <div class="datepicker-wrap" style="flex:1; min-width: 140px;">
        <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
        <input type="date" id="reportTo" class="form-control with-icon native-date" value="${lastDay}" style="height:42px;">
      </div>
      <button class="btn btn-primary" onclick="loadMonthlyReport()" style="height:42px;">${t('generate')}</button>
    </div>
  `;
  document.getElementById('reportTabContent').innerHTML = `<div id="monthlyReportContainer"><div class="empty-state"><p>${t('loading')}</p></div></div>`;
  setTimeout(loadMonthlyReport, 50);
}

window.loadMonthlyReport = async function() {
  const container = document.getElementById('monthlyReportContainer');
  const from = document.getElementById('reportFrom').value;
  const to = document.getElementById('reportTo').value;
  
  if (!from || !to) return toast('Please select both dates', 'error');

  container.innerHTML = `<div class="empty-state"><p>${t('loading')}</p></div>`;
  
  try {
    monthlyReportData = await api(`/api/reports/dynamic?start_date=${from}&end_date=${to}`);
    renderMonthlyTable();
  } catch (err) {
    toast(err.message, 'error');
  }
}

window.renderMonthlyTable = function() {
    const container = document.getElementById('monthlyReportContainer');
    const { paid, overdue } = monthlyReportData;
    
    if (!paid.length && !overdue.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📄</div><p>No data found for this period.</p></div>`;
      return;
    }

    const renderRows = (items, isOverdue) => items.map(item => {
        const percent = item.expected_rent > 0 ? ((item.amount_paid / item.expected_rent) * 100).toFixed(0) : 0;
        const phoneHtml = item.phone_number ? `<a href="https://wa.me/${item.phone_number}" target="_blank" style="color:var(--green);text-decoration:none;font-size:12px;margin-left:8px;">💬</a>` : '';
        return `
        <tr>
          <td data-label="${t('asset_name')}" style="color:var(--text-primary);font-weight:500">${item.asset_name}</td>
          <td data-label="${t('tenant_name')}" style="color:${item.tenant_name === '—' ? 'var(--text-muted)' : 'inherit'}">${item.tenant_name} <span style="font-size:12px;color:var(--text-muted)">${item.phone_number || ''}</span>${phoneHtml}</td>
          <td data-label="${t('expected_rent')}">$${fmt(item.expected_rent)}</td>
          <td data-label="${t('paid_amount')}" style="color:var(--green)">$${fmt(item.amount_paid)} <span style="font-size:11px;color:var(--text-muted)">(${percent}%)</span></td>
          <td data-label="${t('balance')}" style="color:${isOverdue ? 'var(--red)' : 'var(--text-muted)'}">$${fmt(item.balance)}</td>
          <td data-label="${t('status')}"><span class="badge ${isOverdue ? 'badge-red' : 'badge-green'}">${isOverdue ? t('unpaid_status') : t('paid_status')}</span></td>
        </tr>
        `;
    }).join('');

    let html = '';

    if (paid.length > 0) {
        html += `
            <div class="table-card" style="margin-bottom: 24px; border-left: 4px solid var(--green);">
                <div class="table-header"><h3><span style="color:var(--green)">✓</span> ${t('successful_payments')} (${paid.length})</h3></div>
                <table>
                  <thead>
                    <tr>
                      <th>${t('asset_name')}</th>
                      <th>${t('tenant_name')}</th>
                      <th>${t('expected_rent')}</th>
                      <th>${t('paid_amount')}</th>
                      <th>${t('balance')}</th>
                      <th>${t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>${renderRows(paid, false)}</tbody>
                </table>
            </div>
        `;
    }

    if (overdue.length > 0) {
        html += `
            <div class="table-card" style="border-left: 4px solid var(--red);">
                <div class="table-header"><h3><span style="color:var(--red)">!</span> ${t('late_payments')} (${overdue.length})</h3></div>
                <table>
                  <thead>
                    <tr>
                      <th>${t('asset_name')}</th>
                      <th>${t('tenant_name')}</th>
                      <th>${t('expected_rent')}</th>
                      <th>${t('paid_amount')}</th>
                      <th>${t('balance')}</th>
                      <th>${t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>${renderRows(overdue, true)}</tbody>
                </table>
            </div>
        `;
    }

    container.innerHTML = html;
}


let annualAssetsCache = [];
async function renderAnnualTab(container) {
  const currentYear = new Date().getFullYear();
  annualAssetsCache = await api('/api/assets');

  container.innerHTML = `
      <select id="annualAssetId" class="form-control" style="width:180px;height:40px;padding:0 8px;">
        <option value="" disabled selected>${t('select_asset')}</option>
        ${annualAssetsCache.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
      </select>
      <div class="relative datepicker-wrap" style="width:100px;">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg>
        </div>
        <input type="number" id="annualYear" class="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body" value="${currentYear}" style="height:40px;">
      </div>
      <button class="btn btn-primary" onclick="loadAnnualReport()" style="height:40px;">${t('generate')}</button>
  `;
  document.getElementById('reportTabContent').innerHTML = `<div id="annualReportContainer"><div class="empty-state"><p>${t('select_asset')} then generate</p></div></div>`;
}

window.loadAnnualReport = async function() {
  const container = document.getElementById('annualReportContainer');
  const assetId = document.getElementById('annualAssetId').value;
  const year = document.getElementById('annualYear').value;
  
  if (!assetId) return toast(t('select_asset'), 'error');

  container.innerHTML = `<div class="empty-state"><p>${t('loading')}</p></div>`;
  
  try {
    const data = await api('/api/reports/annual/' + assetId + '?year=' + year);
    
    container.innerHTML = `
      <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="stat-card blue"><div class="stat-value">$${fmt(data.total_expected_rent)}</div><div class="stat-label">${t('expected_rent')}</div></div>
        <div class="stat-card green"><div class="stat-value">$${fmt(data.total_paid)}</div><div class="stat-label">${t('paid_amount')}</div></div>
        <div class="stat-card red"><div class="stat-value">$${fmt(data.balance)}</div><div class="stat-label">${t('balance')}</div></div>
      </div>
      
      <h3 style="margin-bottom: 12px; font-size: 15px;">${t('nav_leases')}</h3>
      <div class="table-card" style="margin-bottom: 24px;">
        <table>
          <thead><tr><th>${t('tenant')}</th><th>${t('period')}</th><th>${t('contract')}</th></tr></thead>
          <tbody>
            ${data.leases.length ? data.leases.map(l => `
              <tr>
                <td data-label="${t('tenant')}" style="color:var(--text-primary);font-weight:500">${l.tenant_name}</td>
                <td data-label="${t('period')}">${fmtDate(l.start_date)} → ${fmtDate(l.end_date)}</td>
                <td data-label="${t('contract')}">$${fmt(l.contract_amount)}</td>
              </tr>
            `).join('') : `<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">No leases this year.</td></tr>`}
          </tbody>
        </table>
      </div>

      <h3 style="margin-bottom: 12px; font-size: 15px;">${t('nav_payments')}</h3>
      <div class="table-card">
        <table>
          <thead><tr><th>${t('date')}</th><th>${t('amount')}</th></tr></thead>
          <tbody>
            ${data.payments.length ? data.payments.map(p => `
              <tr>
                <td data-label="${t('date')}">${fmtDate(p.date_collected)}</td>
                <td data-label="${t('amount')}" style="color:var(--green);font-weight:500">$${fmt(p.amount_paid)}</td>
              </tr>
            `).join('') : `<tr><td colspan="2" style="text-align:center;color:var(--text-muted)">No payments this year.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Error: ${err.message}</p></div>`;
  }
}

async function renderExpensesTab(container) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  container.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; width: 100%; margin-bottom: 24px;">
      <select id="expenseReportMonth" class="form-control" style="width:140px; height:42px;">
        <option value="">Full Year</option>
        ${Array.from({length:12}, (_, i) => `<option value="${i+1}" ${i+1===currentMonth?'selected':''}>${new Date(0, i).toLocaleString(currentLang, {month:'long'})}</option>`).join('')}
      </select>
      <input type="number" id="expenseReportYear" class="form-control" value="${currentYear}" style="width:100px; height:42px;">
      <button class="btn btn-primary" onclick="loadExpensesReport()" style="height:42px;">${t('generate')}</button>
    </div>
  `;
  document.getElementById('reportTabContent').innerHTML = `<div id="expenseReportContainer"><div class="empty-state"><p>${t('loading')}</p></div></div>`;
  setTimeout(loadExpensesReport, 50);
}

window.loadExpensesReport = async function() {
  const container = document.getElementById('expenseReportContainer');
  const month = document.getElementById('expenseReportMonth').value;
  const year = document.getElementById('expenseReportYear').value;
  
  container.innerHTML = `<div class="empty-state"><p>${t('loading')}</p></div>`;
  
  try {
    const query = month ? `?year=${year}&month=${month}` : `?year=${year}`;
    const data = await api('/api/reports/expenses' + query);
    renderExpensesTable(data);
  } catch (err) {
    toast(err.message, 'error');
  }
}

function renderExpensesTable(data) {
  const container = document.getElementById('expenseReportContainer');
  
  if (!data.items.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🧾</div><p>No expenses found for this period.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="stat-grid" style="grid-template-columns: 1fr; margin-bottom: 24px;">
      <div class="stat-card yellow">
        <div class="stat-value">$${fmt(data.total_amount)}</div>
        <div class="stat-label">${t('total_expenses')}</div>
      </div>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>${t('item')}</th><th>${t('amount')}</th><th>${t('date')}</th><th>${t('notes')}</th></tr></thead>
        <tbody>
          ${data.items.map(e => `
            <tr>
              <td data-label="${t('item')}" style="color:var(--text-primary);font-weight:500">${e.item}</td>
              <td data-label="${t('amount')}" style="color:var(--red)">$${fmt(e.amount)}</td>
              <td data-label="${t('date')}">${fmtDate(e.date_incurred)}</td>
              <td data-label="${t('notes')}">${e.notes || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.exportToPDF = function() {
  const element = document.getElementById('pageContent');
  const options = {
    margin: [10, 10, 10, 10],
    filename: `RentFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      letterRendering: true, 
      backgroundColor: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#0f1117' 
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  // Temporarily hide things that shouldn't be in PDF
  const filters = document.getElementById('reportFilters');
  const tabs = document.querySelector('.tabs');
  if (filters) filters.style.display = 'none';
  if (tabs) tabs.style.display = 'none';

  html2pdf().set(options).from(element).save().then(() => {
    if (filters) filters.style.display = 'flex';
    if (tabs) tabs.style.display = 'flex';
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function renderDashboard(el, actions) {
  const summary = await api('/api/reports/summary');
  const leases = await api('/api/leases');
  const recentLeases = leases.slice(0, 5);

  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card purple">
        <div class="stat-icon">📁</div>
        <div class="stat-value">${summary.total_asset_types}</div>
        <div class="stat-label">${t('dashboard_types')}</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">🏢</div>
        <div class="stat-value">${summary.total_assets}</div>
        <div class="stat-label">${t('dashboard_total')}</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">📝</div>
        <div class="stat-value">${summary.active_leases}</div>
        <div class="stat-label">${t('dashboard_active')}</div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-icon">💰</div>
        <div class="stat-value">$${fmt(summary.total_revenue)}</div>
        <div class="stat-label">${t('dashboard_revenue')}</div>
      </div>
      <div class="stat-card red">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">$${fmt(summary.pending_balance)}</div>
        <div class="stat-label">${t('dashboard_pending')}</div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>${t('recent_leases')}</h3>
      </div>
      ${recentLeases.length ? `
      <table>
        <thead><tr>
          <th>${t('tenant')}</th><th>${t('asset')}</th><th>${t('contract')}</th><th>${t('paid')}</th><th>${t('remaining')}</th><th>${t('end_date')}</th>
        </tr></thead>
        <tbody>
          ${recentLeases.map(l => `
            <tr>
              <td data-label="${t('tenant')}" style="color:var(--text-primary);font-weight:500">${l.tenant_name}</td>
              <td data-label="${t('asset')}">${l.asset_name || '—'}</td>
              <td data-label="${t('contract')}">$${fmt(l.total_contract_amount)}</td>
              <td data-label="${t('paid')}" style="color:var(--green)">$${fmt(l.paid_amount)}</td>
              <td data-label="${t('remaining')}" style="color:var(--yellow)">$${fmt(l.remaining)}</td>
              <td data-label="${t('end_date')}">${fmtDate(l.end_date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : `<div class="empty-state"><div class="empty-icon">📝</div><p>No leases yet...</p></div>`}
    </div>
  `;
}

// ─── Asset Types ──────────────────────────────────────────────────────────────

async function renderAssetTypes(el, actions) {
  const types = await api('/api/asset-types');

  actions.innerHTML = `<button class="btn btn-primary" onclick="showAssetTypeModal()">${t('btn_new_type')}</button>`;

  if (!types.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📁</div><p>No asset types yet...</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <table>
        <thead><tr><th>${t('name')}</th><th>${t('created')}</th><th style="width:120px">${t('actions')}</th></tr></thead>
        <tbody>
          ${types.map(tData => `
            <tr>
              <td data-label="${t('name')}" style="color:var(--text-primary);font-weight:500">${tData.name}</td>
              <td data-label="${t('created')}">${fmtDate(tData.created_at)}</td>
              <td data-label="${t('actions')}">
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick="showAssetTypeModal('${tData.id}','${tData.name}')">${t('edit')}</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteAssetType('${tData.id}')">${t('delete')}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showAssetTypeModal(id = null, name = '') {
  const isEdit = !!id;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit' : 'New'} Asset Type</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Type Name</label>
            <input class="form-control" id="atName" value="${name}" placeholder="e.g. Room, Store, Car">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveAssetType('${id || ''}')">${isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
    </div>
  `);
  document.getElementById('atName').focus();
}

async function saveAssetType(id) {
  const name = document.getElementById('atName').value.trim();
  if (!name) return toast('Name is required', 'error');
  try {
    if (id) {
      await api(`/api/asset-types/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
      toast('Asset type updated');
    } else {
      await api('/api/asset-types', { method: 'POST', body: JSON.stringify({ name }) });
      toast('Asset type created');
    }
    closeModal();
    navigate('asset-types');
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteAssetType(id) {
  if (!confirm('Delete this asset type?')) return;
  try {
    await api(`/api/asset-types/${id}`, { method: 'DELETE' });
    toast('Asset type deleted');
    navigate('asset-types');
  } catch (e) { toast(e.message, 'error'); }
}

// ─── Assets ───────────────────────────────────────────────────────────────────

let assetTypesCache = [];

async function renderAssets(el, actions) {
  const [assets, types] = await Promise.all([
    api('/api/assets'),
    api('/api/asset-types'),
  ]);
  assetTypesCache = types;

  actions.innerHTML = types.length
    ? `<button class="btn btn-primary" onclick="showAssetModal()">${t('btn_new_asset')}</button>`
    : '<span style="color:var(--text-muted);font-size:12px">Create an asset type first</span>';

  if (!assets.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🏢</div><p>No assets yet.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <table>
        <thead><tr><th>${t('name')}</th><th>${t('type')}</th><th>${t('base_price')}</th><th>${t('status')}</th><th style="width:140px">${t('actions')}</th></tr></thead>
        <tbody>
          ${assets.map(a => `
            <tr>
              <td data-label="${t('name')}" style="color:var(--text-primary);font-weight:500">${a.name}</td>
              <td data-label="${t('type')}">${a.type_name || '—'}</td>
              <td data-label="${t('base_price')}">$${fmt(a.base_price)}</td>
              <td data-label="${t('status')}"><span class="badge ${a.status === 'Available' ? 'badge-green' : a.status === 'Rented' ? 'badge-blue' : 'badge-red'}">${a.status}</span></td>
              <td data-label="${t('actions')}">
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick='showAssetModal(${JSON.stringify(a)})'>${t('edit')}</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteAsset('${a.id}')">${t('delete')}</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showAssetModal(asset = null) {
  const isEdit = !!asset;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${isEdit ? 'Edit' : 'New'} Asset</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Asset Type</label>
            <select class="form-control" id="assetType">
              ${assetTypesCache.map(t => `<option value="${t.id}" ${asset && asset.type_id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Name</label>
            <input class="form-control" id="assetName" value="${asset ? asset.name : ''}" placeholder="e.g. Room 101">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" id="assetDesc" placeholder="Optional description">${asset ? (asset.description || '') : ''}</textarea>
          </div>
          <div class="form-group">
            <label>Base Price</label>
            <input class="form-control" id="assetPrice" type="number" step="0.01" value="${asset ? asset.base_price : '0'}" placeholder="0.00">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" onclick="saveAsset('${asset ? asset.id : ''}')">${isEdit ? 'Update' : 'Create'}</button>
        </div>
      </div>
    </div>
  `);
}

async function saveAsset(id) {
  const payload = {
    type_id: document.getElementById('assetType').value,
    name: document.getElementById('assetName').value.trim(),
    description: document.getElementById('assetDesc').value.trim() || null,
    base_price: parseFloat(document.getElementById('assetPrice').value) || 0,
  };
  if (!payload.name) return toast('Name is required', 'error');
  try {
    if (id) {
      await api(`/api/assets/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      toast('Asset updated');
    } else {
      await api('/api/assets', { method: 'POST', body: JSON.stringify(payload) });
      toast('Asset created');
    }
    closeModal();
    navigate('assets');
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteAsset(id) {
  if (!confirm('Delete this asset? (soft-delete — financial history preserved)')) return;
  try {
    await api(`/api/assets/${id}`, { method: 'DELETE' });
    toast('Asset deleted');
    navigate('assets');
  } catch (e) { toast(e.message, 'error'); }
}

// ─── Leases ───────────────────────────────────────────────────────────────────

let assetsCache = [];

async function renderLeases(el, actions) {
  const [leases, assets] = await Promise.all([
    api('/api/leases'),
    api('/api/assets'),
  ]);
  assetsCache = assets.filter(a => a.status === 'Available');

  actions.innerHTML = assetsCache.length
    ? `<button class="btn btn-primary" onclick="showLeaseModal()">${t('btn_new_lease')}</button>`
    : '<span style="color:var(--text-muted);font-size:12px">No available assets</span>';

  if (!leases.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>No leases yet.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <table>
        <thead><tr><th>${t('tenant')}</th><th>${t('asset')}</th><th>${t('period')}</th><th>${currentLang === 'ar' ? 'الإيجار الشهري' : 'Monthly Rent'}</th><th>${t('contract')}</th><th>${t('paid')}</th><th>${t('remaining')}</th><th style="width:120px">${t('actions')}</th></tr></thead>
        <tbody>
          ${leases.map(l => {
            const start = new Date(l.start_date);
            const end = new Date(l.end_date);
            let months = (end.getFullYear() - start.getFullYear()) * 12;
            months -= start.getMonth();
            months += end.getMonth();
            const daysDiff = end.getDate() - start.getDate();
            const exactMonths = months + (daysDiff / 30);
            const finalMonths = Math.max(1, Math.round(exactMonths * 10) / 10);
            const monthlyRent = Number(l.total_contract_amount) / finalMonths;

            return `
            <tr>
              <td data-label="${t('tenant')}" style="color:var(--text-primary);font-weight:500">${l.tenant_name}</td>
              <td data-label="${t('asset')}">${l.asset_name || '—'}</td>
              <td data-label="${t('period')}">${fmtDate(l.start_date)} → ${fmtDate(l.end_date)}</td>
              <td data-label="${currentLang === 'ar' ? 'الإيجار الشهري' : 'Monthly Rent'}">$${fmt(monthlyRent)}</td>
              <td data-label="${t('contract')}">$${fmt(l.total_contract_amount)}</td>
              <td data-label="${t('paid')}" style="color:var(--green)">$${fmt(l.paid_amount)}</td>
              <td data-label="${t('remaining')}" style="color:${Number(l.remaining) > 0 ? 'var(--yellow)' : 'var(--green)'}">$${fmt(l.remaining)}</td>
              <td data-label="${t('actions')}">
                <div class="action-btns">
                  <button class="btn btn-secondary btn-sm" onclick='showLeaseEditModal(${JSON.stringify(l)})'>${t('edit')}</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteLease('${l.id}')">${t('delete')}</button>
                </div>
              </td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showLeaseModal() {
  const today = new Date().toISOString().split('T')[0];
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${t('btn_new_lease')}</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t('asset')}</label>
            <select class="form-control" id="leaseAsset" style="cursor:pointer">
              ${assetsCache.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>${t('tenant')}</label>
            <input class="form-control" id="leaseTenant">
          </div>
          <div class="form-group">
            <label>${t('phone_number')}</label>
            <input class="form-control" id="leasePhone" placeholder="+1234567890">
          </div>
          <div class="form-group">
            <label>${t('start_date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="leaseStart" class="form-control with-icon native-date" value="${today}" min="${today}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('end_date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="leaseEnd" class="form-control with-icon native-date" value="${today}" min="${today}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('contract')}</label>
            <input class="form-control" id="leaseMonthlyAmount" type="number" step="0.01" placeholder="Monthly rent">
          </div>
          <div class="form-group">
            <label>${currentLang === 'ar' ? 'إجمالي العقد (تلقائي)' : 'Total Contract (Auto)'}</label>
            <input class="form-control" id="leaseAmount" type="number" disabled style="background: var(--bg-card); font-weight: bold;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="saveLease()">${t('create')}</button>
        </div>
      </div>
    </div>
  `);
  bindLeaseCalculations();
}

function showLeaseEditModal(lease) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${t('edit')} Lease</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t('tenant')}</label>
            <input class="form-control" id="leaseTenant" value="${lease.tenant_name}">
          </div>
          <div class="form-group">
            <label>${t('phone_number')}</label>
            <input class="form-control" id="leasePhone" value="${lease.phone_number || ''}" placeholder="+1234567890">
          </div>
          <div class="form-group">
            <label>${t('start_date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="leaseStart" class="form-control with-icon native-date" value="${lease.start_date}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('end_date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="leaseEnd" class="form-control with-icon native-date" value="${lease.end_date}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('contract')}</label>
            <input class="form-control" id="leaseMonthlyAmount" type="number" step="0.01" placeholder="Monthly rent">
          </div>
          <div class="form-group">
            <label>${currentLang === 'ar' ? 'إجمالي العقد (تلقائي)' : 'Total Contract (Auto)'}</label>
            <input class="form-control" id="leaseAmount" type="number" value="${lease.total_contract_amount}" disabled style="background: var(--bg-card); font-weight: bold;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="updateLease('${lease.id}')">${t('update')}</button>
        </div>
      </div>
    </div>
  `);
  bindLeaseCalculations();
}

function bindLeaseCalculations() {
  const startEl = document.getElementById('leaseStart');
  const endEl = document.getElementById('leaseEnd');
  const monthlyEl = document.getElementById('leaseMonthlyAmount');
  const totalEl = document.getElementById('leaseAmount');

  function calculate() {
    if (!startEl.value || !endEl.value || !monthlyEl.value) return;
    const start = new Date(startEl.value);
    const end = new Date(endEl.value);
    if (end < start) {
      totalEl.value = '0.00';
      return;
    }
    
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    
    // Calculate partial month difference based on days
    const daysDiff = end.getDate() - start.getDate();
    // Assuming approx 30 days a month for simple proration if exactly month-to-month isn't aligned
    const exactMonths = months + (daysDiff / 30);
    // If it's a flat whole month selection (e.g. Jan 1 to Jan 31), ensure it counts as 1.
    const finalMonths = Math.max(1, Math.round(exactMonths * 10) / 10);
    
    const total = finalMonths * parseFloat(monthlyEl.value || 0);
    totalEl.value = total.toFixed(2);
  }

  startEl.addEventListener('change', calculate);
  endEl.addEventListener('change', calculate);
  monthlyEl.addEventListener('input', calculate);
}

async function saveLease() {
  const payload = {
    asset_id: document.getElementById('leaseAsset').value,
    tenant_name: document.getElementById('leaseTenant').value.trim(),
    phone_number: document.getElementById('leasePhone').value.trim() || null,
    start_date: document.getElementById('leaseStart').value,
    end_date: document.getElementById('leaseEnd').value,
    total_contract_amount: parseFloat(document.getElementById('leaseAmount').value) || 0,
  };
  if (!payload.tenant_name || !payload.start_date || !payload.end_date) return toast('All fields are required', 'error');

  const todayStr = new Date().toISOString().split('T')[0];
  if (payload.start_date < todayStr) return toast(currentLang === 'ar' ? 'لا يمكن اختيار تاريخ قبل اليوم' : 'Cannot select a date before today', 'error');
  if (payload.end_date < payload.start_date) return toast(currentLang === 'ar' ? 'تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء' : 'End date cannot be before start date', 'error');

  try {
    await api('/api/leases', { method: 'POST', body: JSON.stringify(payload) });
    toast('Lease created');
    closeModal();
    navigate('leases');
  } catch (e) { toast(e.message, 'error'); }
}

async function updateLease(id) {
  const payload = {
    tenant_name: document.getElementById('leaseTenant').value.trim(),
    phone_number: document.getElementById('leasePhone').value.trim() || null,
    start_date: document.getElementById('leaseStart').value,
    end_date: document.getElementById('leaseEnd').value,
    total_contract_amount: parseFloat(document.getElementById('leaseAmount').value) || 0,
  };

  if (!payload.tenant_name || !payload.start_date || !payload.end_date) return toast('All fields are required', 'error');

  const todayStr = new Date().toISOString().split('T')[0];
  if (payload.start_date < todayStr) return toast(currentLang === 'ar' ? 'لا يمكن اختيار تاريخ قبل اليوم' : 'Cannot select a date before today', 'error');
  if (payload.end_date < payload.start_date) return toast(currentLang === 'ar' ? 'تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء' : 'End date cannot be before start date', 'error');

  try {
    await api(`/api/leases/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    toast('Lease updated');
    closeModal();
    navigate('leases');
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteLease(id) {
  if (!confirm('Delete this lease? The asset will be freed.')) return;
  try {
    await api(`/api/leases/${id}`, { method: 'DELETE' });
    toast('Lease deleted');
    navigate('leases');
  } catch (e) { toast(e.message, 'error'); }
}

// ─── Payments ─────────────────────────────────────────────────────────────────

let leasesCache = [];

async function renderPayments(el, actions) {
  const [payments, leases] = await Promise.all([
    api('/api/payments'),
    api('/api/leases'),
  ]);
  leasesCache = leases;

  actions.innerHTML = leases.length
    ? `<button class="btn btn-primary" onclick="showPaymentModal()">${t('btn_new_payment')}</button>`
    : '<span style="color:var(--text-muted);font-size:12px">No leases yet</span>';

  if (!payments.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><p>No payments recorded yet.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <table>
        <thead><tr><th>${t('tenant')}</th><th>${t('amount')}</th><th>${t('method')}</th><th>${t('date')}</th><th style="width:80px">${t('actions')}</th></tr></thead>
        <tbody>
          ${payments.map(p => `
            <tr>
              <td data-label="${t('tenant')}" style="color:var(--text-primary);font-weight:500">${p.tenant_name || '—'}</td>
              <td data-label="${t('amount')}" style="color:var(--green)">$${fmt(p.amount_paid)}</td>
              <td data-label="${t('method')}"><span class="badge badge-blue">${p.payment_method}</span></td>
              <td data-label="${t('date')}">${fmtDate(p.date_collected)}</td>
              <td data-label="${t('actions')}">
                <button class="btn btn-danger btn-sm" onclick="deletePayment('${p.id}')">${t('delete')}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showPaymentModal() {
  const today = new Date().toISOString().split('T')[0];
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${t('record')} Payment</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Lease</label>
            <select class="form-control" id="payLease">
              ${leasesCache.map(l => `<option value="${l.id}">${l.tenant_name} — $${fmt(l.remaining)} remaining</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>${t('amount')}</label>
            <input class="form-control" id="payAmount" type="number" step="0.01" placeholder="0.00">
          </div>
          <div class="form-group">
            <label>${t('date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="payDate" class="form-control with-icon native-date" value="${today}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('method')}</label>
            <select class="form-control" id="payMethod">
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Check</option>
              <option>Credit Card</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="savePayment()">${t('record')}</button>
        </div>
      </div>
    </div>
  `);
}

async function savePayment() {
  const payload = {
    lease_id: document.getElementById('payLease').value,
    amount_paid: parseFloat(document.getElementById('payAmount').value) || 0,
    date_collected: document.getElementById('payDate').value,
    payment_method: document.getElementById('payMethod').value,
  };
  if (!payload.amount_paid || !payload.date_collected) return toast('Amount and date are required', 'error');
  try {
    await api('/api/payments', { method: 'POST', body: JSON.stringify(payload) });
    toast('Payment recorded');
    closeModal();
    navigate('payments');
  } catch (e) { toast(e.message, 'error'); }
}

async function deletePayment(id) {
  if (!confirm('Delete this payment record?')) return;
  try {
    await api(`/api/payments/${id}`, { method: 'DELETE' });
    toast('Payment deleted');
    navigate('payments');
  } catch (e) { toast(e.message, 'error'); }
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

async function renderExpenses(el, actions) {
  const expenses = await api('/api/expenses');

  actions.innerHTML = `<button class="btn btn-primary" onclick="showExpenseModal()">${t('btn_new_expense')}</button>`;

  if (!expenses.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🧾</div><p>No expenses recorded yet.</p></div>';
    return;
  }

  el.innerHTML = `
    <div class="table-card">
      <table>
        <thead><tr><th>${t('item')}</th><th>${t('amount')}</th><th>${t('date')}</th><th>${t('notes')}</th><th style="width:80px">${t('actions')}</th></tr></thead>
        <tbody>
          ${expenses.map(e => `
            <tr>
              <td data-label="${t('item')}" style="color:var(--text-primary);font-weight:500">${e.item}</td>
              <td data-label="${t('amount')}" style="color:var(--yellow)">$${fmt(e.amount)}</td>
              <td data-label="${t('date')}">${fmtDate(e.date_incurred)}</td>
              <td data-label="${t('notes')}">${e.notes || '—'}</td>
              <td data-label="${t('actions')}">
                <button class="btn btn-danger btn-sm" onclick="deleteExpense('${e.id}')">${t('delete')}</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showExpenseModal() {
  const today = new Date().toISOString().split('T')[0];
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal">
        <div class="modal-header">
          <h3>${t('btn_new_expense')}</h3>
          <button class="btn btn-icon btn-secondary" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>${t('item')}</label>
            <input class="form-control" id="expenseItem">
          </div>
          <div class="form-group">
            <label>${t('amount')}</label>
            <input class="form-control" id="expenseAmount" type="number" step="0.01" placeholder="0.00">
          </div>
          <div class="form-group">
            <label>${t('date')}</label>
            <div class="datepicker-wrap">
              <div class="datepicker-icon"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/></svg></div>
              <input type="date" id="expenseDate" class="form-control with-icon native-date" value="${today}">
            </div>
          </div>
          <div class="form-group">
            <label>${t('notes')}</label>
            <input class="form-control" id="expenseNotes">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
          <button class="btn btn-primary" onclick="saveExpense()">${t('record')}</button>
        </div>
      </div>
    </div>
  `);
}

async function saveExpense() {
  const payload = {
    item: document.getElementById('expenseItem').value.trim(),
    amount: parseFloat(document.getElementById('expenseAmount').value) || 0,
    date_incurred: document.getElementById('expenseDate').value,
    notes: document.getElementById('expenseNotes').value.trim() || null,
  };
  if (!payload.item || !payload.amount || !payload.date_incurred) return toast('Item, amount, and date are required', 'error');
  try {
    await api('/api/expenses', { method: 'POST', body: JSON.stringify(payload) });
    toast('Expense recorded');
    closeModal();
    navigate('expenses');
  } catch (e) { toast(e.message, 'error'); }
}

async function deleteExpense(id) {
  if (!confirm('Delete this expense?')) return;
  try {
    await api(`/api/expenses/${id}`, { method: 'DELETE' });
    toast('Expense deleted');
    navigate('expenses');
  } catch (e) { toast(e.message, 'error'); }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function initTheme() {
  const theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeUI();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeUI();
}

function updateThemeUI() {
  const theme = document.documentElement.getAttribute('data-theme');
  const icon = document.getElementById('themeIcon');
  const label = document.querySelector('#themeToggle span.label');
  
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  if (label) {
    label.setAttribute('data-i18n', theme === 'dark' ? 'theme_dark' : 'theme_light');
    label.textContent = t(theme === 'dark' ? 'theme_dark' : 'theme_light');
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
initTheme();
document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
document.documentElement.lang = currentLang;

document.querySelectorAll('[data-i18n]').forEach(el => {
  el.textContent = t(el.getAttribute('data-i18n'));
});

initNotifications();
navigate('dashboard');
