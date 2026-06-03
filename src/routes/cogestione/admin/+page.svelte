<script lang="ts">
  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()

  function formatDate(d: Date): string {
    return d.toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit',
      hour: '2-digit', minute: '2-digit'
    })
  }

  type Status = 'ok' | 'warning' | 'error'

  const statusLabel: Record<Status, string> = {
    ok: 'ok',
    warning: 'attenzione',
    error: 'errore',
  }

  type ChecklistCard = {
    label: string
    primary: string
    secondary: string
    status: Status
    href: string
  }

  type ChecklistGroup = {
    label: string
    cards: ChecklistCard[]
  }

  // $derived recomputes when SvelteKit re-runs load() after a form action, keeping UI in sync
  const calendarGroup = $derived<ChecklistGroup>({
    label: 'Calendario',
    cards: [
      {
        label: 'Giorni dell\'evento',
        primary: String(data.totalEventDays),
        secondary: data.totalEventDays > 0 ? 'giorni configurati' : 'nessun giorno',
        status: data.totalEventDays > 0 ? 'ok' : 'error',
        href: '/cogestione/admin/days',
      },
      {
        label: 'Finestra iscrizioni',
        primary: (() => {
          if (!data.registrationWindow) return 'N/D'
          const now = new Date()
          const { opening, closing } = data.registrationWindow
          if (now < opening) return `Apre ${formatDate(opening)}`
          if (now > closing) return 'Chiusa'
          return 'Aperta'
        })(),
        secondary: (() => {
          if (!data.registrationWindow) return 'N/D'
          return `${formatDate(data.registrationWindow.opening)} – ${formatDate(data.registrationWindow.closing)}`
        })(),
        status: data.registrationWindow ? 'ok' : 'error',
        href: '/cogestione/admin/opening',
      },
    ],
  })

  const structureGroup = $derived<ChecklistGroup>({
    label: 'Struttura',
    cards: [
      {
        label: 'Attività',
        primary: String(data.totalActivities),
        secondary: 'attività disponibili',
        status: data.totalActivities > 0 ? 'ok' : 'error',
        href: '/cogestione/admin/activities',
      },
      {
        label: 'Turni',
        primary: String(data.totalTurns),
        secondary: data.totalTurns > 0 ? 'turni configurati' : 'nessun turno',
        status: data.totalActivities === 0 || data.totalTurns === 0 ? 'error' : 'ok',
        href: '/cogestione/admin/turns',
      },
      {
        label: 'Organizzatori',
        primary: String(data.totalOrganizers),
        secondary: 'assegnati alle attività',
        status: data.totalOrganizers > 0 ? 'ok' : 'error',
        href: '/cogestione/admin/organizers',
      },
    ],
  })

  const usersGroup = $derived<ChecklistGroup>({
    label: 'Utenti',
    cards: [
      {
        label: 'Utenti caricati',
        primary: String(data.totalUsers),
        secondary: 'utenti nel database',
        status: data.totalUsers > 0 ? 'ok' : 'error',
        href: '/cogestione/admin/users',
      },
      {
        label: 'Ruoli',
        primary: `${data.totalSecurity} sicurezza`,
        secondary: `${data.totalRepresentants} rappresentanti`,
        status: (() => {
          if (data.totalSecurity > 0 && data.totalRepresentants > 0) return 'ok'
          if (data.totalSecurity > 0 || data.totalRepresentants > 0) return 'warning'
          return 'error'
        })(),
        href: '/cogestione/admin/roles',
      },
      {
        label: 'Biglietti',
        primary: String(data.totalTickets),
        secondary: `su ${String(data.totalStudents)} studenti`,
        status: (() => {
          if (data.totalStudents > 0 && data.totalTickets >= data.totalStudents) return 'ok'
          return data.totalTickets > 0 ? 'warning' : 'error'
        })(),
        href: '/cogestione/admin/tickets',
      },
    ],
  })

  const checklistGroups = $derived([calendarGroup, structureGroup, usersGroup])
  const allCards = $derived(checklistGroups.flatMap(g => g.cards))
  const okCount = $derived(allCards.filter(c => c.status === 'ok').length)

  const stats = $derived([
    { label: 'Iscritti',    value: String(data.studentsRegistered) },
    { label: 'Ticket',   value: String(data.totalTickets) },
    { label: 'Ticket validati',    value: String(data.ticketsValidated) },
    { label: 'Scan oggi',   value: String(data.totalScansToday) },
    { label: 'Scan totali', value: String(data.totalScans) },
  ])
</script>

<svelte:head>
  <title>Bea - Admin</title>
</svelte:head>

<div class="page">

  <div class="page-header">
    <h1>Panoramica</h1>
    <span class="readiness-count">{okCount} / {allCards.length}</span>
  </div>

  <div class="checklist-area">
    {#each checklistGroups as group}
      <div class="checklist-section">
        <span class="group-label">{group.label}</span>
        <div class="checklist-grid">
          {#each group.cards as item}
            <div class="item-card">
              <span class="item-label">{item.label}</span>
              <div class="value-group">
                <span class="item-primary">{item.primary}</span>
                {#if item.secondary}
                  <span class="item-secondary">{item.secondary}</span>
                {/if}
              </div>
              <div class="item-footer">
                <div class="status-group">
                  <span class="dot {item.status}"></span>
                  <span class="status-text {item.status}">{statusLabel[item.status]}</span>
                </div>
                <a href={item.href} class="config-link" aria-label="Configura {item.label}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="stats-section">
    <span class="group-label">Statistiche</span>
    <div class="stats-card">
      {#each stats as stat}
        <div class="stat-item">
          <span class="stat-number">{stat.value}</span>
          <span class="stat-label">{stat.label}</span>
        </div>
      {/each}
    </div>
  </div>

</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 30px;
  }

  /* Header */

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  h1 {
    font-size: max(30px, 18px + 1.25vw);
    color: var(--red);
    filter: brightness(1.4);
  }

  .readiness-count {
    font-size: max(20px, 15px + 0.4vw);
    font-weight: normal;
    color: var(--white);
    opacity: 0.35;
    line-height: 1;
  }

  /* Checklist */

  .checklist-area {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .checklist-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .group-label {
    font-size: max(11px, 9px + 0.1vw);
    font-weight: normal;
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .checklist-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .item-card {
    flex: 1 1 220px;
    background: var(--grey);
    border-radius: 15px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    min-height: 170px;
  }

  .item-label {
    font-size: max(11px, 9px + 0.15vw);
    font-weight: normal;
    opacity: 1;
  }

  .value-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .item-primary {
    font-size: max(26px, 18px + 1vw);
    color: var(--red);
    filter: brightness(1.4);
    line-height: 1;
  }

  .item-secondary {
    font-size: max(13px, 10px + 0.25vw);
    font-weight: normal;
    opacity: 1;
  }

  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-group {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot.ok      { background: var(--green); filter: brightness(1.3); }
  .dot.warning { background: var(--yellow); }
  .dot.error   { background: var(--red); filter: brightness(1.4); }

  .status-text {
    font-size: max(11px, 9px + 0.1vw);
    font-weight: normal;
  }
  .status-text.ok      { color: var(--green); filter: brightness(1.3); }
  .status-text.warning { color: var(--yellow); }
  .status-text.error   { color: var(--red); filter: brightness(1.4); }

  .config-link {
    display: flex;
    align-items: center;
    color: var(--white);
    opacity: 0.2;
    transition: opacity 0.15s ease;
  }

  .config-link:hover {
    opacity: 0.7;
  }

  /* Stats */

  .stats-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stats-card {
    background: var(--grey);
    border-radius: 15px;
    padding: 30px;
    display: flex;
    flex-wrap: nowrap;
    gap: 20px;
  }

  .stat-item {
    flex: 1 1 0;
    min-width: 0; /* allows items to shrink below content size */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .stat-number {
    font-size: max(32px, 24px + 1vw);
    color: var(--red);
    filter: brightness(1.4);
    line-height: 1;
  }

  .stat-label {
    font-size: max(12px, 10px + 0.15vw);
    font-weight: normal;
    opacity: 1;
  }

  /* ─── Responsive ─────────────────────────────────── */

  @media (max-width: 900px) {
    .stats-card {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
    }

    /*
     * Each item spans 2 of 6 columns (= 1/3 width).
     * Row 2 items are offset by 1 column so they sit centered
     * in the gaps between the row 1 items.
     */
    .stat-item:nth-child(1) { grid-column: 1 / 3; }
    .stat-item:nth-child(2) { grid-column: 3 / 5; }
    .stat-item:nth-child(3) { grid-column: 5 / 7; }
    .stat-item:nth-child(4) { grid-column: 2 / 4; }
    .stat-item:nth-child(5) { grid-column: 4 / 6; }
  }

  @media (max-width: 600px) {
    .page {
      padding-top: 15px;
      gap: 15px;
    }

    .checklist-area {
      gap: 20px;
    }

    .item-card {
      min-height: auto;
    }

    .stats-card {
      padding: 20px;
    }
  }
</style>
