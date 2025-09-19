<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Dashboard - BGMI Tournaments</title>

    <!-- CSS -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- Firebase -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>

    <!-- Cloudinary -->
    <script
      src="https://upload-widget.cloudinary.com/global/all.js"
      type="text/javascript"
    ></script>
    <!-- SheetJS for Excel Export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <style>
      body {
        font-family: "Poppins", sans-serif;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
        color: #ffffff;
        min-height: 100vh;
      }
      .admin-header {
        background: linear-gradient(45deg, #a6d719, #7fb800);
        color: #000;
        padding: 15px 0;
        margin-bottom: 20px;
      }
      .admin-header h1 {
        font-size: clamp(1.5rem, 4vw, 2rem);
        margin: 0;
      }
      .admin-nav {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px 0;
        margin-bottom: 20px;
        border-radius: 10px;
      }
      .nav-pills .nav-link {
        color: #ffffff;
        background: transparent;
        border-radius: 25px;
        margin: 5px;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        padding: 8px 16px;
      }
      .nav-pills .nav-link.active {
        background: #a6d719;
        color: #000;
      }
      .admin-card {
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid #333;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
      }
      .admin-card:hover {
        border-color: #a6d719;
      }
      .admin-card h3 {
        color: #a6d719;
        margin-bottom: 15px;
        font-size: clamp(1.1rem, 3vw, 1.3rem);
      }
      .form-control,
      .form-select {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #333;
        border-radius: 10px;
        color: #ffffff;
        margin-bottom: 10px;
        font-size: 0.9rem;
        padding: 8px 12px;
      }
      .form-control:focus,
      .form-select:focus {
        background: rgba(166, 215, 25, 0.1);
        border-color: #a6d719;
        color: #ffffff;
        box-shadow: none;
      }
      .form-control::placeholder {
        color: #999;
      }
      .form-select option {
        background: #1a1a1a;
        color: #ffffff;
      }
      .btn-primary {
        background: linear-gradient(45deg, #a6d719, #7fb800);
        border: none;
        color: #000;
        font-weight: 600;
        border-radius: 25px;
        padding: 8px 20px;
        font-size: 0.9rem;
      }
      .btn-danger {
        background: linear-gradient(45deg, #dc3545, #c82333);
        border: none;
        border-radius: 25px;
        padding: 6px 15px;
        font-size: 0.8rem;
      }
      .btn-warning {
        background: linear-gradient(45deg, #ffc107, #e0a800);
        border: none;
        color: #000;
        border-radius: 25px;
        padding: 6px 15px;
        font-size: 0.8rem;
      }
      .btn-success {
        background: linear-gradient(45deg, #28a745, #20c997);
        border: none;
        color: #fff;
        border-radius: 25px;
        padding: 6px 15px;
        font-size: 0.8rem;
      }
      .btn-export {
        background: linear-gradient(45deg, #17a2b8, #138496);
        border: none;
        color: #fff;
        border-radius: 25px;
        padding: 8px 20px;
        font-size: 0.9rem;
        margin-bottom: 15px;
      }
      .tournament-item,
      .team-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tournament-info h5 {
        color: #a6d719;
        margin-bottom: 5px;
        font-size: 1rem;
      }
      .tournament-info p {
        margin: 0;
        color: #cccccc;
        font-size: 0.8rem;
      }
      .action-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      .stat-card {
        background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        border: 2px solid #a6d719;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
      }
      .stat-number {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 700;
        color: #a6d719;
        margin-bottom: 8px;
      }
      .stat-label {
        color: #cccccc;
        font-size: clamp(0.8rem, 2vw, 1.1rem);
      }
      .table-dark {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        overflow: hidden;
        font-size: 0.8rem;
      }
      .table-dark th {
        background: #a6d719;
        color: #000;
        border: none;
        font-size: 0.75rem;
        padding: 10px 8px;
      }
      .table-dark td {
        border-color: #333;
        padding: 8px;
      }
      .cloudinary-upload {
        width: 100%;
        padding: 10px;
        background: linear-gradient(45deg, #a6d719, #7fb800);
        color: #000;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }
      .cloudinary-upload:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(166, 215, 25, 0.4);
      }
      .upload-preview {
        margin-top: 10px;
        text-align: center;
      }
      .upload-preview img {
        max-width: 100%;
        max-height: 120px;
        border-radius: 10px;
        object-fit: cover;
      }
      .result-form {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 15px;
        border: 1px solid #333;
        margin-bottom: 15px;
      }
      .result-form h4 {
        color: #a6d719;
        margin-bottom: 15px;
        font-size: clamp(1rem, 3vw, 1.2rem);
      }
      .team-position {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
      }
      .team-position h6 {
        color: #ffd700;
        margin-bottom: 10px;
      }
      .position-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      }
      /* Filter Styles for Teams Tab */
      .teams-filters {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 20px;
        border: 1px solid #333;
      }
      .teams-filters h4 {
        color: #a6d719;
        margin-bottom: 15px;
        font-size: 1.2rem;
      }
      .filter-row {
        display: flex;
        gap: 15px;
        align-items: end;
        flex-wrap: wrap;
      }
      .filter-group {
        flex: 1;
        min-width: 200px;
      }
      .filter-group label {
        display: block;
        color: #ffd700;
        font-weight: 600;
        margin-bottom: 5px;
        font-size: 0.9rem;
      }
      .filter-select {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #333;
        border-radius: 10px;
        color: #ffffff;
        padding: 8px 12px;
        font-size: 0.9rem;
      }
      .filter-select:focus {
        border-color: #a6d719;
        outline: none;
      }
      .filter-select option {
        background: #1a1a1a;
        color: #ffffff;
      }
      .filter-reset {
        background: linear-gradient(45deg, #dc3545, #c82333);
        color: #fff;
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.9rem;
        height: fit-content;
      }
      .filter-reset:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
      }
      .tournament-badge {
        background: linear-gradient(45deg, #a6d719, #7fb800);
        color: #000;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      /* Top Performers Management */
      .performers-form {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 15px;
        border: 1px solid #333;
        margin-bottom: 15px;
      }
      .performers-form h4 {
        color: #a6d719;
        margin-bottom: 15px;
        font-size: clamp(1rem, 3vw, 1.2rem);
      }
      .performer-input {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #333;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 10px;
      }
      .performer-input h6 {
        color: #ffd700;
        margin-bottom: 10px;
      }
      /* Pagination Styles */
      .pagination-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        gap: 15px;
      }
      .pagination-info {
        color: #cccccc;
        font-size: 0.9rem;
      }
      .pagination-controls {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .pagination-btn {
        background: linear-gradient(45deg, #a6d719, #7fb800);
        color: #000;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }
      .pagination-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(166, 215, 25, 0.4);
      }
      .pagination-btn:disabled {
        background: #666;
        color: #999;
        cursor: not-allowed;
        transform: none;
      }
      .page-numbers {
        display: flex;
        gap: 5px;
      }
      .page-number {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        border: 2px solid #333;
        padding: 6px 10px;
        border-radius: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
      }
      .page-number.active {
        background: linear-gradient(45deg, #a6d719, #7fb800);
        color: #000;
        border-color: #a6d719;
      }
      .page-number:hover:not(.active) {
        background: rgba(166, 215, 25, 0.2);
        border-color: #a6d719;
      }
      /* Export Status */
      .export-status {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 9999;
        max-width: 300px;
        display: none;
      }
      .export-status.success {
        background: rgba(40, 167, 69, 0.9);
        color: #fff;
        border: 2px solid #28a745;
      }
      .export-status.error {
        background: rgba(220, 53, 69, 0.9);
        color: #fff;
        border: 2px solid #dc3545;
      }
      .export-status.loading {
        background: rgba(255, 193, 7, 0.9);
        color: #000;
        border: 2px solid #ffc107;
      }
      /* Enhanced Mobile Responsive */
      @media (max-width: 768px) {
        .container {
          padding: 0 10px;
        }
        .admin-header {
          padding: 10px 0;
        }
        .admin-header .d-flex {
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }
        .nav-pills {
          flex-wrap: wrap;
          justify-content: center;
        }
        .nav-pills .nav-link {
          margin: 2px;
          padding: 6px 12px;
          font-size: 0.8rem;
        }
        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .stat-card {
          padding: 15px;
        }
        .admin-card {
          padding: 15px;
          margin-bottom: 15px;
        }
        .tournament-item,
        .team-item {
          flex-direction: column;
          align-items: flex-start;
          padding: 12px;
        }
        .action-buttons {
          width: 100%;
          justify-content: flex-end;
        }
        .table-responsive {
          font-size: 0.7rem;
        }
        .form-control,
        .form-select {
          font-size: 0.8rem;
          padding: 6px 10px;
        }
        .result-form,
        .performers-form {
          padding: 15px;
        }
        .row .col-md-4,
        .row .col-md-6 {
          margin-bottom: 10px;
        }
        .filter-row {
          flex-direction: column;
          gap: 10px;
        }
        .filter-group {
          min-width: 100%;
        }
        .pagination-controls {
          flex-wrap: wrap;
          justify-content: center;
        }
        .page-numbers {
          flex-wrap: wrap;
          justify-content: center;
        }
      }
      @media (max-width: 480px) {
        .stats-grid {
          grid-template-columns: 1fr 1fr;
        }
        .stat-card {
          padding: 10px;
        }
        .admin-card {
          padding: 10px;
        }
        .tournament-info h5 {
          font-size: 0.9rem;
        }
        .tournament-info p {
          font-size: 0.7rem;
        }
        .table-dark th,
        .table-dark td {
          padding: 6px 4px;
          font-size: 0.7rem;
        }
      }
    </style>
  </head>
  <body>
    <!-- Admin Header -->
    <div class="admin-header">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h1><i class="fas fa-cog"></i> Admin Dashboard</h1>
          <div>
            <span id="adminEmail">Welcome, Admin</span>
            <button class="btn btn-outline-dark ms-3" onclick="logout()">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Export Status -->
    <div id="exportStatus" class="export-status">
      <span id="exportMessage"></span>
    </div>
    <div class="container">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="totalTournaments">0</div>
          <div class="stat-label">Total Tournaments</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="totalTeams">0</div>
          <div class="stat-label">Registered Teams</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="activeTournaments">0</div>
          <div class="stat-label">Active Tournaments</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="totalPrizePool">₹0</div>
          <div class="stat-label">Total Prize Pool</div>
        </div>
      </div>
      <!-- Navigation Tabs -->
      <div class="admin-nav">
        <ul class="nav nav-pills justify-content-center">
          <li class="nav-item">
            <a
              class="nav-link active"
              data-bs-toggle="pill"
              href="#tournaments"
            >
              <i class="fas fa-trophy"></i> Tournaments
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="pill" href="#teams">
              <i class="fas fa-users"></i> Teams
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="pill" href="#results">
              <i class="fas fa-medal"></i> Results
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" data-bs-toggle="pill" href="#performers">
              <i class="fas fa-star"></i> Top Performers
            </a>
          </li>
        </ul>
      </div>
      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Tournaments Tab -->
        <div class="tab-pane fade show active" id="tournaments">
          <div class="row">
            <div class="col-lg-6">
              <div class="admin-card">
                <h3>
                  <i class="fas fa-plus"></i>
                  <span id="formTitle">Create New Tournament</span>
                </h3>
                <form id="createTournamentForm">
                  <input type="hidden" id="editTournamentId" />
                  <div class="row">
                    <div class="col-md-6">
                      <input
                        type="text"
                        class="form-control"
                        id="tournamentName"
                        placeholder="Tournament Name"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <input
                        type="number"
                        class="form-control"
                        id="prizePool"
                        placeholder="Prize Pool (₹)"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <input
                        type="number"
                        class="form-control"
                        id="entryFee"
                        placeholder="Entry Fee (₹)"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <input
                        type="number"
                        class="form-control"
                        id="maxSlots"
                        placeholder="Max Slots"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <select class="form-select" id="gameMode" required>
                        <option value="">Select Game Mode</option>
                        <option value="Squad TPP">Squad TPP</option>
                        <option value="Squad FPP">Squad FPP</option>
                        <option value="Duo TPP">Duo TPP</option>
                        <option value="Duo FPP">Duo FPP</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <input
                        type="datetime-local"
                        class="form-control"
                        id="tournamentDate"
                        required
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <input
                        type="datetime-local"
                        class="form-control"
                        id="registrationStartDate"
                        placeholder="Registration Start"
                        required
                      />
                      <small class="text-muted">Registration Start Date</small>
                    </div>
                    <div class="col-md-6">
                      <input
                        type="datetime-local"
                        class="form-control"
                        id="registrationEndDate"
                        placeholder="Registration End"
                        required
                      />
                      <small class="text-muted">Registration End Date</small>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <select
                        class="form-select"
                        id="tournamentStatus"
                        required
                      >
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <button
                        type="button"
                        class="cloudinary-upload"
                        onclick="uploadTournamentImage()"
                      >
                        <i class="fas fa-upload"></i> Upload Tournament Image
                      </button>
                    </div>
                  </div>
                  <textarea
                    class="form-control"
                    id="description"
                    placeholder="Tournament Description"
                    rows="3"
                  ></textarea>
                  <div id="tournamentImagePreview" class="upload-preview"></div>
                  <input type="hidden" id="tournamentImageUrl" />
                  <button type="submit" class="btn btn-primary" id="submitBtn">
                    <i class="fas fa-plus"></i> Create Tournament
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    id="cancelBtn"
                    onclick="cancelEdit()"
                    style="display: none"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="admin-card">
                <h3><i class="fas fa-list"></i> Existing Tournaments</h3>
                <div id="tournamentsList">
                  <!-- Tournaments will be loaded here -->
                </div>

                <!-- Pagination for Tournaments -->
                <div
                  class="pagination-wrapper"
                  id="tournaments-admin-pagination"
                >
                  <div class="pagination-info">
                    <span id="tournaments-admin-pagination-info"
                      >Showing 0-0 of 0 tournaments</span
                    >
                  </div>
                  <div class="pagination-controls">
                    <button
                      class="pagination-btn"
                      id="tournaments-admin-prev-btn"
                      onclick="changeTournamentsAdminPage(-1)"
                      disabled
                    >
                      <i class="fas fa-chevron-left"></i> Previous
                    </button>
                    <div
                      class="page-numbers"
                      id="tournaments-admin-page-numbers"
                    >
                      <!-- Page numbers will be generated here -->
                    </div>
                    <button
                      class="pagination-btn"
                      id="tournaments-admin-next-btn"
                      onclick="changeTournamentsAdminPage(1)"
                      disabled
                    >
                      Next <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Teams Tab -->
        <div class="tab-pane fade" id="teams">
          <!-- Enhanced Filter Section -->
          <div class="teams-filters">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4><i class="fas fa-filter"></i> Filter Teams</h4>
              <button class="btn-export" onclick="exportToExcel()">
                <i class="fas fa-file-excel"></i> Export to Excel
              </button>
            </div>
            <div class="filter-row">
              <div class="filter-group">
                <label>Filter by Tournament</label>
                <select class="filter-select" id="adminTournamentFilter">
                  <option value="">All Tournaments</option>
                </select>
              </div>
              <div class="filter-group">
                <label>Filter by Team Name</label>
                <select class="filter-select" id="adminTeamNameFilter">
                  <option value="">All Teams</option>
                </select>
              </div>
              <button class="filter-reset" onclick="resetAdminFilters()">
                <i class="fas fa-refresh"></i> Reset
              </button>
            </div>
          </div>
          <div class="admin-card">
            <h3><i class="fas fa-users"></i> Registered Teams</h3>
            <div class="table-responsive">
              <table class="table table-dark">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Team Name</th>
                    <th>Leader</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Tournament</th>
                    <th>Players</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="teamsTableBody">
                  <!-- Teams will be loaded here -->
                </tbody>
              </table>
            </div>

            <!-- Pagination for Admin Teams -->
            <div class="pagination-wrapper" id="teams-admin-pagination">
              <div class="pagination-info">
                <span id="teams-admin-pagination-info"
                  >Showing 0-0 of 0 teams</span
                >
              </div>
              <div class="pagination-controls">
                <button
                  class="pagination-btn"
                  id="teams-admin-prev-btn"
                  onclick="changeTeamsAdminPage(-1)"
                  disabled
                >
                  <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="page-numbers" id="teams-admin-page-numbers">
                  <!-- Page numbers will be generated here -->
                </div>
                <button
                  class="pagination-btn"
                  id="teams-admin-next-btn"
                  onclick="changeTeamsAdminPage(1)"
                  disabled
                >
                  Next <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Results Tab -->
        <div class="tab-pane fade" id="results">
          <div class="admin-card">
            <h3><i class="fas fa-medal"></i> Tournament Results Management</h3>

            <!-- Add Result Form -->
            <div class="result-form">
              <h4>Add Tournament Result</h4>
              <form id="addResultForm">
                <div class="row">
                  <div class="col-md-6">
                    <select
                      class="form-select"
                      id="resultTournamentId"
                      required
                    >
                      <option value="">Select Tournament</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <input
                      type="date"
                      class="form-control"
                      id="completedDate"
                      required
                    />
                  </div>
                </div>

                <div id="teamsContainer">
                  <div class="team-position">
                    <h6>🏆 1st Place</h6>
                    <div class="row">
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Team Name"
                          name="teamName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Points"
                          name="points"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="kills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Prize (₹)"
                          name="prize"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="team-position">
                    <h6>🥈 2nd Place</h6>
                    <div class="row">
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Team Name"
                          name="teamName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Points"
                          name="points"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="kills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Prize (₹)"
                          name="prize"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="team-position">
                    <h6>🥉 3rd Place</h6>
                    <div class="row">
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Team Name"
                          name="teamName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Points"
                          name="points"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="kills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Prize (₹)"
                          name="prize"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="position-controls">
                  <button
                    type="button"
                    class="btn btn-success"
                    onclick="addTeamPosition()"
                  >
                    <i class="fas fa-plus"></i> Add Position
                  </button>
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Result
                  </button>
                </div>
              </form>
            </div>
            <!-- Existing Results -->
            <div id="resultsList">
              <!-- Results will be loaded here -->
            </div>

            <!-- Pagination for Results -->
            <div class="pagination-wrapper" id="results-admin-pagination">
              <div class="pagination-info">
                <span id="results-admin-pagination-info"
                  >Showing 0-0 of 0 results</span
                >
              </div>
              <div class="pagination-controls">
                <button
                  class="pagination-btn"
                  id="results-admin-prev-btn"
                  onclick="changeResultsAdminPage(-1)"
                  disabled
                >
                  <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="page-numbers" id="results-admin-page-numbers">
                  <!-- Page numbers will be generated here -->
                </div>
                <button
                  class="pagination-btn"
                  id="results-admin-next-btn"
                  onclick="changeResultsAdminPage(1)"
                  disabled
                >
                  Next <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Top Performers Tab -->
        <div class="tab-pane fade" id="performers">
          <div class="admin-card">
            <h3><i class="fas fa-star"></i> Top Performers Management</h3>

            <!-- Add Top Performers Form -->
            <div class="performers-form">
              <h4>Add Top 5 Performers</h4>
              <form id="addPerformersForm">
                <div class="row">
                  <div class="col-md-12">
                    <select
                      class="form-select"
                      id="performersTournamentId"
                      required
                    >
                      <option value="">Select Tournament</option>
                    </select>
                  </div>
                </div>

                <div id="performersContainer">
                  <div class="performer-input">
                    <h6>🏆 1st Place Performer</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Player Name/IGN"
                          name="performerName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="performerKills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Play Time (e.g., 120m)"
                          name="performerPlayTime"
                        />
                      </div>
                      <div class="col-md-2">
                        <button
                          type="button"
                          class="cloudinary-upload"
                          onclick="uploadPerformerImage(0)"
                        >
                          <i class="fas fa-upload"></i> Image
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="performerImageUrl" />
                    <div class="upload-preview" id="performerPreview0"></div>
                  </div>

                  <div class="performer-input">
                    <h6>🥈 2nd Place Performer</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Player Name/IGN"
                          name="performerName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="performerKills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Play Time (e.g., 120m)"
                          name="performerPlayTime"
                        />
                      </div>
                      <div class="col-md-2">
                        <button
                          type="button"
                          class="cloudinary-upload"
                          onclick="uploadPerformerImage(1)"
                        >
                          <i class="fas fa-upload"></i> Image
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="performerImageUrl" />
                    <div class="upload-preview" id="performerPreview1"></div>
                  </div>

                  <div class="performer-input">
                    <h6>🥉 3rd Place Performer</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Player Name/IGN"
                          name="performerName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="performerKills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Play Time (e.g., 120m)"
                          name="performerPlayTime"
                        />
                      </div>
                      <div class="col-md-2">
                        <button
                          type="button"
                          class="cloudinary-upload"
                          onclick="uploadPerformerImage(2)"
                        >
                          <i class="fas fa-upload"></i> Image
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="performerImageUrl" />
                    <div class="upload-preview" id="performerPreview2"></div>
                  </div>

                  <div class="performer-input">
                    <h6>🏅 4th Place Performer</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Player Name/IGN"
                          name="performerName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="performerKills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Play Time (e.g., 120m)"
                          name="performerPlayTime"
                        />
                      </div>
                      <div class="col-md-2">
                        <button
                          type="button"
                          class="cloudinary-upload"
                          onclick="uploadPerformerImage(3)"
                        >
                          <i class="fas fa-upload"></i> Image
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="performerImageUrl" />
                    <div class="upload-preview" id="performerPreview3"></div>
                  </div>

                  <div class="performer-input">
                    <h6>🏅 5th Place Performer</h6>
                    <div class="row">
                      <div class="col-md-4">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Player Name/IGN"
                          name="performerName"
                          required
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="number"
                          class="form-control"
                          placeholder="Kills"
                          name="performerKills"
                        />
                      </div>
                      <div class="col-md-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Play Time (e.g., 120m)"
                          name="performerPlayTime"
                        />
                      </div>
                      <div class="col-md-2">
                        <button
                          type="button"
                          class="cloudinary-upload"
                          onclick="uploadPerformerImage(4)"
                        >
                          <i class="fas fa-upload"></i> Image
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="performerImageUrl" />
                    <div class="upload-preview" id="performerPreview4"></div>
                  </div>
                </div>

                <div class="position-controls">
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Top Performers
                  </button>
                </div>
              </form>
            </div>
            <!-- Existing Top Performers -->
            <div id="performersList">
              <!-- Top Performers will be loaded here -->
            </div>

            <!-- Pagination for Top Performers -->
            <div class="pagination-wrapper" id="performers-admin-pagination">
              <div class="pagination-info">
                <span id="performers-admin-pagination-info"
                  >Showing 0-0 of 0 performers</span
                >
              </div>
              <div class="pagination-controls">
                <button
                  class="pagination-btn"
                  id="performers-admin-prev-btn"
                  onclick="changePerformersAdminPage(-1)"
                  disabled
                >
                  <i class="fas fa-chevron-left"></i> Previous
                </button>
                <div class="page-numbers" id="performers-admin-page-numbers">
                  <!-- Page numbers will be generated here -->
                </div>
                <button
                  class="pagination-btn"
                  id="performers-admin-next-btn"
                  onclick="changePerformersAdminPage(1)"
                  disabled
                >
                  Next <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    <script>
      // Firebase Configuration
      const firebaseConfig = {
        apiKey: "AIzaSyD0217GQzsRtIoNkmBTJChQvcfoRJ6A2TU",
        authDomain: "esports-playertrack.firebaseapp.com",
        projectId: "esports-playertrack",
        storageBucket: "esports-playertrack.firebasestorage.app",
        messagingSenderId: "529146709633",
        appId: "1:529146709633:web:c64ee6db91c6a3299fc2f80",
        measurementId: "G-XBBBTKLSNW",
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
      const auth = firebase.auth();
      // Cloudinary Configuration
      const cloudinaryConfig = {
        cloudName: "dlmcpmdpn",
        apiKey: "676721267434562",
        apiSecret: "coUfy0zhcw88LjzWYsS2B7doFds",
      };
      let tournaments = [];
      let registeredTeams = [];
      let filteredAdminTeams = [];
      let results = [];
      let topPerformers = [];
      let tournamentImageWidget;
      let performerImageWidgets = [];
      let isEditMode = false;
      let teamPositionCount = 3;
      // Pagination Variables
      let tournamentsAdminCurrentPage = 1;
      let teamsAdminCurrentPage = 1;
      let resultsAdminCurrentPage = 1;
      let performersAdminCurrentPage = 1;
      const itemsPerPage = 10;
      // Check authentication
      auth.onAuthStateChanged((user) => {
        if (!user) {
          window.location.href = "login.html";
          return;
        }

        document.getElementById(
          "adminEmail"
        ).textContent = `Welcome, ${user.email}`;
        initializeDashboard();
      });
      // Initialize Dashboard
      async function initializeDashboard() {
        initializeCloudinary();
        await updateStats();
        await loadTournaments();
        await loadTeams();
        await loadResults();
        await loadTopPerformers();
        await loadTournamentOptions();
        await loadPerformerTournamentOptions();
        initializeAdminFilters();

        // Form submissions
        document
          .getElementById("createTournamentForm")
          .addEventListener("submit", handleTournamentSubmit);
        document
          .getElementById("addResultForm")
          .addEventListener("submit", handleAddResult);
        document
          .getElementById("addPerformersForm")
          .addEventListener("submit", handleAddPerformers);

        // Add tab change event listener
        const tabLinks = document.querySelectorAll('[data-bs-toggle="pill"]');
        tabLinks.forEach((link) => {
          link.addEventListener("shown.bs.tab", function (e) {
            const targetTab = e.target.getAttribute("href");
            if (targetTab === "#results") {
              setTimeout(() => {
                loadTournamentOptions();
              }, 100);
            }
            if (targetTab === "#performers") {
              setTimeout(() => {
                loadPerformerTournamentOptions();
              }, 100);
            }
            if (targetTab === "#teams") {
              setTimeout(() => {
                populateAdminFilterOptions();
              }, 100);
            }
          });
        });
      }
      // Excel Export Function
      async function exportToExcel() {
        try {
          showExportStatus("Preparing Excel export...", "loading");
          // Prepare data for export
          const headers = [
            "Team Name",
            "Tournament",
            "Team Leader",
            "Email",
            "Phone",
            "Registration Date",
            "Player 1 IGN",
            "Player 1 UUID",
            "Player 2 IGN",
            "Player 2 UUID",
            "Player 3 IGN",
            "Player 3 UUID",
            "Player 4 IGN",
            "Player 4 UUID",
            "Additional Players",
          ];
          const data = [headers];
          // Add team data
          filteredAdminTeams.forEach((team) => {
            const tournament = tournaments.find(
              (t) => t.id === team.tournamentId
            );
            const tournamentName = tournament ? tournament.name : "Unknown";

            const row = [
              team.teamName,
              tournamentName,
              team.teamLeaderName,
              team.teamLeaderEmail || "",
              team.phoneNumber,
              new Date(team.registrationDate).toLocaleDateString(),
              team.players[0]?.ign || "",
              team.players[0]?.uuid || "",
              team.players[1]?.ign || "",
              team.players[1]?.uuid || "",
              team.players[2]?.ign || "",
              team.players[2]?.uuid || "",
              team.players[3]?.ign || "",
              team.players[3]?.uuid || "",
              team.players.length > 4
                ? team.players
                    .slice(4)
                    .map((p) => `${p.ign} (${p.uuid})`)
                    .join(", ")
                : "",
            ];
            data.push(row);
          });
          showExportStatus("Creating Excel file...", "loading");
          // Create workbook and worksheet
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(data);
          // Set column widths
          const colWidths = [
            { wch: 20 }, // Team Name
            { wch: 25 }, // Tournament
            { wch: 20 }, // Team Leader
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 15 }, // Registration Date
            { wch: 15 }, // Player 1 IGN
            { wch: 20 }, // Player 1 UUID
            { wch: 15 }, // Player 2 IGN
            { wch: 20 }, // Player 2 UUID
            { wch: 15 }, // Player 3 IGN
            { wch: 20 }, // Player 3 UUID
            { wch: 15 }, // Player 4 IGN
            { wch: 20 }, // Player 4 UUID
            { wch: 30 }, // Additional Players
          ];
          ws["!cols"] = colWidths;
          // Style the header row
          const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "A6D719" } },
            alignment: { horizontal: "center" },
          };
          // Apply header styling
          for (let i = 0; i < headers.length; i++) {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = headerStyle;
          }
          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, "BGMI Tournament Teams");
          // Generate filename with current date
          const filename = `BGMI_Tournament_Teams_${
            new Date().toISOString().split("T")[0]
          }.xlsx`;
          showExportStatus("Downloading file...", "loading");
          // Save file
          XLSX.writeFile(wb, filename);
          showExportStatus("Excel file downloaded successfully!", "success");
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            hideExportStatus();
          }, 5000);
        } catch (error) {
          console.error("Error exporting to Excel:", error);
          showExportStatus("Export failed. Please try again.", "error");
        }
      }
      function showExportStatus(message, type) {
        const statusDiv = document.getElementById("exportStatus");
        const messageSpan = document.getElementById("exportMessage");

        statusDiv.className = `export-status ${type}`;
        messageSpan.innerHTML = message;
        statusDiv.style.display = "block";
        if (type === "error") {
          setTimeout(() => {
            hideExportStatus();
          }, 5000);
        }
      }
      function hideExportStatus() {
        document.getElementById("exportStatus").style.display = "none";
      }
      // Initialize Admin Filters
      function initializeAdminFilters() {
        const tournamentFilter = document.getElementById(
          "adminTournamentFilter"
        );
        const teamNameFilter = document.getElementById("adminTeamNameFilter");
        tournamentFilter.addEventListener("change", applyAdminFilters);
        teamNameFilter.addEventListener("change", applyAdminFilters);
      }
      function populateAdminFilterOptions() {
        const tournamentFilter = document.getElementById(
          "adminTournamentFilter"
        );
        const teamNameFilter = document.getElementById("adminTeamNameFilter");
        // Clear existing options (except "All" options)
        tournamentFilter.innerHTML =
          '<option value="">All Tournaments</option>';
        teamNameFilter.innerHTML = '<option value="">All Teams</option>';
        // Get unique tournaments
        const uniqueTournaments = [
          ...new Set(
            registeredTeams.map((team) => {
              const tournament = tournaments.find(
                (t) => t.id === team.tournamentId
              );
              return tournament ? tournament.name : "Unknown";
            })
          ),
        ];
        // Get unique team names
        const uniqueTeamNames = [
          ...new Set(registeredTeams.map((team) => team.teamName)),
        ];
        // Populate tournament filter
        uniqueTournaments.forEach((tournamentName) => {
          const option = document.createElement("option");
          option.value = tournamentName;
          option.textContent = tournamentName;
          tournamentFilter.appendChild(option);
        });
        // Populate team name filter
        uniqueTeamNames.forEach((teamName) => {
          const option = document.createElement("option");
          option.value = teamName;
          option.textContent = teamName;
          teamNameFilter.appendChild(option);
        });
      }
      function applyAdminFilters() {
        const tournamentFilter = document.getElementById(
          "adminTournamentFilter"
        ).value;
        const teamNameFilter = document.getElementById(
          "adminTeamNameFilter"
        ).value;
        filteredAdminTeams = registeredTeams.filter((team) => {
          const tournament = tournaments.find(
            (t) => t.id === team.tournamentId
          );
          const tournamentName = tournament ? tournament.name : "Unknown";
          const matchesTournament =
            !tournamentFilter || tournamentName === tournamentFilter;
          const matchesTeamName =
            !teamNameFilter || team.teamName === teamNameFilter;
          return matchesTournament && matchesTeamName;
        });
        teamsAdminCurrentPage = 1; // Reset to first page
        renderTeams();
      }
      function resetAdminFilters() {
        document.getElementById("adminTournamentFilter").value = "";
        document.getElementById("adminTeamNameFilter").value = "";
        filteredAdminTeams = [...registeredTeams];
        teamsAdminCurrentPage = 1; // Reset to first page
        renderTeams();
      }
      // Pagination Functions for Admin
      function changeTournamentsAdminPage(direction) {
        const totalPages = Math.ceil(tournaments.length / itemsPerPage);
        const newPage = tournamentsAdminCurrentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
          tournamentsAdminCurrentPage = newPage;
          renderTournaments();
        }
      }
      function goToTournamentsAdminPage(page) {
        const totalPages = Math.ceil(tournaments.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
          tournamentsAdminCurrentPage = page;
          renderTournaments();
        }
      }
      function changeTeamsAdminPage(direction) {
        const totalPages = Math.ceil(filteredAdminTeams.length / itemsPerPage);
        const newPage = teamsAdminCurrentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
          teamsAdminCurrentPage = newPage;
          renderTeams();
        }
      }
      function goToTeamsAdminPage(page) {
        const totalPages = Math.ceil(filteredAdminTeams.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
          teamsAdminCurrentPage = page;
          renderTeams();
        }
      }
      function changeResultsAdminPage(direction) {
        const totalPages = Math.ceil(results.length / itemsPerPage);
        const newPage = resultsAdminCurrentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
          resultsAdminCurrentPage = newPage;
          renderResults();
        }
      }
      function goToResultsAdminPage(page) {
        const totalPages = Math.ceil(results.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
          resultsAdminCurrentPage = page;
          renderResults();
        }
      }
      function changePerformersAdminPage(direction) {
        const totalPages = Math.ceil(topPerformers.length / itemsPerPage);
        const newPage = performersAdminCurrentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
          performersAdminCurrentPage = newPage;
          renderTopPerformers();
        }
      }
      function goToPerformersAdminPage(page) {
        const totalPages = Math.ceil(topPerformers.length / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
          performersAdminCurrentPage = page;
          renderTopPerformers();
        }
      }
      function renderAdminPagination(
        containerId,
        currentPage,
        totalItems,
        changePageFunction,
        goToPageFunction
      ) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        // Update pagination info
        const infoSpan = container.querySelector(".pagination-info span");
        if (infoSpan) {
          infoSpan.textContent = `Showing ${startItem}-${endItem} of ${totalItems} items`;
        }
        // Update previous button
        const prevBtn = container.querySelector(
          ".pagination-btn:first-of-type"
        );
        if (prevBtn) {
          prevBtn.disabled = currentPage === 1;
        }
        // Update next button
        const nextBtn = container.querySelector(".pagination-btn:last-of-type");
        if (nextBtn) {
          nextBtn.disabled = currentPage === totalPages;
        }
        // Generate page numbers
        const pageNumbersContainer = container.querySelector(".page-numbers");
        if (pageNumbersContainer) {
          pageNumbersContainer.innerHTML = "";
          const maxVisiblePages = 5;
          let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
          );
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }
          for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement("div");
            pageBtn.className = `page-number ${
              i === currentPage ? "active" : ""
            }`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToPageFunction(i);
            pageNumbersContainer.appendChild(pageBtn);
          }
        }
      }
      // Initialize Cloudinary
      function initializeCloudinary() {
        // Tournament image widget
        tournamentImageWidget = cloudinary.createUploadWidget(
          {
            cloudName: cloudinaryConfig.cloudName,
            uploadPreset: "bgmicolab",
            sources: ["local", "url", "camera"],
            multiple: false,
            maxFileSize: 2000000,
            clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
            folder: "bgmi-tournaments/tournament-images",
            transformation: [
              {
                width: 800,
                height: 400,
                crop: "fill",
                quality: "auto",
                format: "auto",
              },
            ],
            styles: {
              palette: {
                window: "#1a1a1a",
                sourceBg: "#2a2a2a",
                windowBorder: "#a6d719",
                tabIcon: "#a6d719",
                inactiveTabIcon: "#666",
                menuIcons: "#a6d719",
                link: "#a6d719",
                action: "#a6d719",
                inProgress: "#a6d719",
                complete: "#a6d719",
                error: "#dc3545",
                textDark: "#ffffff",
                textLight: "#cccccc",
              },
            },
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              const imageUrl = result.info.secure_url;
              document.getElementById("tournamentImageUrl").value = imageUrl;
              document.getElementById(
                "tournamentImagePreview"
              ).innerHTML = `<img src="${imageUrl}" alt="Tournament Image" style="max-width: 200px; max-height: 150px; border-radius: 10px; object-fit: cover;">`;
              showMessage("Tournament image uploaded successfully!", "success");
            }
            if (error) {
              console.error("Cloudinary upload error:", error);
              showMessage("Error uploading image. Please try again.", "error");
            }
          }
        );
        // Initialize performer image widgets
        for (let i = 0; i < 5; i++) {
          performerImageWidgets[i] = cloudinary.createUploadWidget(
            {
              cloudName: cloudinaryConfig.cloudName,
              uploadPreset: "bgmicolab",
              sources: ["local", "url", "camera"],
              multiple: false,
              maxFileSize: 1000000,
              clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
              folder: "bgmi-tournaments/performer-images",
              transformation: [
                {
                  width: 300,
                  height: 300,
                  crop: "fill",
                  quality: "auto",
                  format: "auto",
                },
              ],
              styles: {
                palette: {
                  window: "#1a1a1a",
                  sourceBg: "#2a2a2a",
                  windowBorder: "#a6d719",
                  tabIcon: "#a6d719",
                  inactiveTabIcon: "#666",
                  menuIcons: "#a6d719",
                  link: "#a6d719",
                  action: "#a6d719",
                  inProgress: "#a6d719",
                  complete: "#a6d719",
                  error: "#dc3545",
                  textDark: "#ffffff",
                  textLight: "#cccccc",
                },
              },
            },
            (error, result) => {
              if (!error && result && result.event === "success") {
                const imageUrl = result.info.secure_url;
                const performerInputs =
                  document.querySelectorAll(".performer-input");
                performerInputs[i].querySelector(
                  'input[name="performerImageUrl"]'
                ).value = imageUrl;
                document.getElementById(
                  `performerPreview${i}`
                ).innerHTML = `<img src="${imageUrl}" alt="Performer Image" style="max-width: 100px; max-height: 100px; border-radius: 10px; object-fit: cover;">`;
                showMessage(
                  `Performer ${i + 1} image uploaded successfully!`,
                  "success"
                );
              }
              if (error) {
                console.error("Cloudinary upload error:", error);
                showMessage(
                  "Error uploading performer image. Please try again.",
                  "error"
                );
              }
            }
          );
        }
      }
      // Upload Functions
      function uploadTournamentImage() {
        tournamentImageWidget.open();
      }
      function uploadPerformerImage(index) {
        performerImageWidgets[index].open();
      }
      async function updateStats() {
        try {
          // Get tournaments count
          const tournamentsSnapshot = await db.collection("tournaments").get();
          const totalTournaments = tournamentsSnapshot.size;

          // Get teams count
          const teamsSnapshot = await db.collection("teamRegistrations").get();
          const totalTeams = teamsSnapshot.size;

          // Get active tournaments
          const activeTournamentsSnapshot = await db
            .collection("tournaments")
            .where("status", "==", "open")
            .get();
          const activeTournaments = activeTournamentsSnapshot.size;

          // Calculate total prize pool
          let totalPrizePool = 0;
          tournamentsSnapshot.forEach((doc) => {
            const tournament = doc.data();
            totalPrizePool += tournament.prizePool || 0;
          });
          // Update UI
          document.getElementById("totalTournaments").textContent =
            totalTournaments;
          document.getElementById("totalTeams").textContent = totalTeams;
          document.getElementById("activeTournaments").textContent =
            activeTournaments;
          document.getElementById("totalPrizePool").textContent =
            "₹" + totalPrizePool.toLocaleString();
        } catch (error) {
          console.error("Error updating stats:", error);
        }
      }
      async function loadTournaments() {
        try {
          console.log("Loading tournaments for admin dashboard...");

          // Try without orderBy first to avoid index issues
          const snapshot = await db.collection("tournaments").get();

          tournaments = [];
          snapshot.forEach((doc) => {
            console.log("Found tournament in admin:", doc.id, doc.data());
            tournaments.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          console.log("Total tournaments loaded in admin:", tournaments.length);

          // Sort manually by createdAt
          tournaments.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          });

          renderTournaments();
        } catch (error) {
          console.error("Error loading tournaments in admin:", error);

          // Show error message in the tournaments list
          const tournamentsList = document.getElementById("tournamentsList");
          if (tournamentsList) {
            tournamentsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #dc3545;">
              <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
              <p>Failed to load tournaments</p>
              <p style="font-size: 0.9rem;">Error: ${error.message}</p>
              <p style="font-size: 0.8rem; margin-top: 10px;">Check console for more details</p>
            </div>
          `;
          }
        }
      }
      function renderTournaments() {
        const tournamentsList = document.getElementById("tournamentsList");

        if (tournaments.length === 0) {
          tournamentsList.innerHTML =
            '<p class="text-muted">No tournaments created yet.</p>';
          document.getElementById(
            "tournaments-admin-pagination"
          ).style.display = "none";
          return;
        }
        // Show pagination
        document.getElementById("tournaments-admin-pagination").style.display =
          "flex";
        // Calculate pagination
        const startIndex = (tournamentsAdminCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTournaments = tournaments.slice(startIndex, endIndex);
        tournamentsList.innerHTML = paginatedTournaments
          .map(
            (tournament) => `
        <div class="tournament-item">
          <div class="tournament-info">
            <h5>${tournament.name}</h5>
            <p>Prize: ₹${tournament.prizePool.toLocaleString()} | Registered: ${
              tournament.registeredTeams || 0
            }/${tournament.maxSlots}</p>
            <p>Date: ${new Date(
              tournament.tournamentDate
            ).toLocaleDateString()} | Status: ${(
              tournament.status || "upcoming"
            ).toUpperCase()}</p>
            ${
              tournament.registrationStartDate && tournament.registrationEndDate
                ? `<p>Registration: ${new Date(
                    tournament.registrationStartDate
                  ).toLocaleDateString()} - ${new Date(
                    tournament.registrationEndDate
                  ).toLocaleDateString()}</p>`
                : ""
            }
          </div>
          <div class="action-buttons">
            <button class="btn btn-warning btn-sm" onclick="editTournament('${
              tournament.id
            }')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTournament('${
              tournament.id
            }')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
          )
          .join("");
        // Render pagination
        renderAdminPagination(
          "tournaments-admin-pagination",
          tournamentsAdminCurrentPage,
          tournaments.length,
          changeTournamentsAdminPage,
          goToTournamentsAdminPage
        );
      }
      async function loadTeams() {
        try {
          const snapshot = await db
            .collection("teamRegistrations")
            .orderBy("registrationDate", "desc")
            .get();
          registeredTeams = [];
          snapshot.forEach((doc) => {
            registeredTeams.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          filteredAdminTeams = [...registeredTeams];
          populateAdminFilterOptions();
          renderTeams();
        } catch (error) {
          console.error("Error loading teams:", error);
        }
      }
      function getTeamInitials(teamName) {
        return teamName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
          .substring(0, 2);
      }
      function renderTeams() {
        const teamsTableBody = document.getElementById("teamsTableBody");
        if (filteredAdminTeams.length === 0) {
          teamsTableBody.innerHTML = `
          <tr>
            <td colspan="9" class="text-center text-muted py-4">
              ${
                registeredTeams.length === 0
                  ? "No teams registered yet."
                  : "No teams match the current filters."
              }
            </td>
          </tr>
        `;
          document.getElementById("teams-admin-pagination").style.display =
            "none";
          return;
        }
        // Show pagination
        document.getElementById("teams-admin-pagination").style.display =
          "flex";
        // Calculate pagination
        const startIndex = (teamsAdminCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTeams = filteredAdminTeams.slice(startIndex, endIndex);
        teamsTableBody.innerHTML = paginatedTeams
          .map((team) => {
            const tournament = tournaments.find(
              (t) => t.id === team.tournamentId
            );
            return `
          <tr>
            <td>
              ${
                team.logoUrl
                  ? `<img src="${team.logoUrl}" alt="${team.teamName}"
                     style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(45deg, #ffd700, #ffb347); color: #000; font-weight: 700; font-size: 0.8rem; align-items: center; justify-content: center;">${getTeamInitials(
                  team.teamName
                )}</div>`
                  : `<div style="width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(45deg, #ffd700, #ffb347); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem;">${getTeamInitials(
                      team.teamName
                    )}</div>`
              }
            </td>
            <td>${team.teamName}</td>
            <td>${team.teamLeaderName}</td>
            <td>${team.teamLeaderEmail || "N/A"}</td>
            <td>${team.phoneNumber}</td>
            <td>
              <div class="tournament-badge">${
                tournament ? tournament.name : "Unknown"
              }</div>
            </td>
            <td>
              ${team.players
                .slice(0, 2)
                .map((player, i) => `<small>${player.ign || player}</small>`)
                .join("<br>")}
              ${
                team.players.length > 2
                  ? `<small>+${team.players.length - 2} more</small>`
                  : ""
              }
            </td>
            <td>${new Date(team.registrationDate).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteTeam('${
                team.id
              }')">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
          })
          .join("");
        // Render pagination
        renderAdminPagination(
          "teams-admin-pagination",
          teamsAdminCurrentPage,
          filteredAdminTeams.length,
          changeTeamsAdminPage,
          goToTeamsAdminPage
        );
      }
      async function loadResults() {
        try {
          console.log("Loading tournament results...");

          // Try without orderBy first to avoid index issues
          const snapshot = await db.collection("tournamentResults").get();

          results = [];
          snapshot.forEach((doc) => {
            console.log("Found result:", doc.id, doc.data());
            results.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          console.log("Total results loaded:", results.length);

          // Sort manually by completedDate
          results.sort((a, b) => {
            const dateA = new Date(a.completedDate || 0);
            const dateB = new Date(b.completedDate || 0);
            return dateB - dateA;
          });

          renderResults();
        } catch (error) {
          console.error("Error loading results:", error);

          // Show error message
          const resultsList = document.getElementById("resultsList");
          if (resultsList) {
            resultsList.innerHTML = `
            <div class="text-center text-danger py-5">
              <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
              <h4>Failed to load results</h4>
              <p>Error: ${error.message}</p>
              <p style="font-size: 0.9rem;">Check console for more details</p>
            </div>
          `;
          }
        }
      }
      function renderResults() {
        const resultsList = document.getElementById("resultsList");
        if (results.length === 0) {
          resultsList.innerHTML = `
          <div class="text-center text-muted py-5">
            <i class="fas fa-trophy fa-3x mb-3"></i>
            <h4>No results available</h4>
            <p>Tournament results will appear here once added.</p>
          </div>
        `;
          document.getElementById("results-admin-pagination").style.display =
            "none";
          return;
        }
        // Show pagination
        document.getElementById("results-admin-pagination").style.display =
          "flex";
        // Calculate pagination
        const startIndex = (resultsAdminCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedResults = results.slice(startIndex, endIndex);
        resultsList.innerHTML = paginatedResults
          .map(
            (result) => `
        <div class="tournament-item">
          <div class="tournament-info">
            <h5>${result.tournamentName}</h5>
            ${
              result.teamResults
                ? result.teamResults
                    .slice(0, 3)
                    .map(
                      (team, index) =>
                        `<p>${getPositionIcon(index + 1)} ${
                          index + 1
                        }${getOrdinalSuffix(index + 1)}: ${team.teamName} (${
                          team.points || 0
                        }pts, ${team.kills || 0} kills, ₹${(
                          team.prize || 0
                        ).toLocaleString()})</p>`
                    )
                    .join("")
                : '<p class="text-muted">No team results available</p>'
            }
            ${
              result.topPerformers
                ? `<p><strong>Top Performer:</strong> ${
                    result.topPerformers[0]?.playerName
                  } (${result.topPerformers[0]?.kills || 0} kills)</p>`
                : ""
            }
            <p>Completed: ${new Date(
              result.completedDate
            ).toLocaleDateString()}</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-danger btn-sm" onclick="deleteResult('${
              result.id
            }')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
          )
          .join("");
        // Render pagination
        renderAdminPagination(
          "results-admin-pagination",
          resultsAdminCurrentPage,
          results.length,
          changeResultsAdminPage,
          goToResultsAdminPage
        );
      }
      async function loadTopPerformers() {
        try {
          const snapshot = await db
            .collection("topPerformers")
            .orderBy("createdAt", "desc")
            .get();
          topPerformers = [];
          snapshot.forEach((doc) => {
            topPerformers.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          renderTopPerformers();
        } catch (error) {
          console.error("Error loading top performers:", error);
        }
      }
      function renderTopPerformers() {
        const performersList = document.getElementById("performersList");
        if (topPerformers.length === 0) {
          performersList.innerHTML = `
          <div class="text-center text-muted py-5">
            <i class="fas fa-star fa-3x mb-3"></i>
            <h4>No top performers available</h4>
            <p>Top performers will appear here once added.</p>
          </div>
        `;
          document.getElementById("performers-admin-pagination").style.display =
            "none";
          return;
        }
        // Show pagination
        document.getElementById("performers-admin-pagination").style.display =
          "flex";
        // Calculate pagination
        const startIndex = (performersAdminCurrentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPerformers = topPerformers.slice(startIndex, endIndex);
        performersList.innerHTML = paginatedPerformers
          .map((performerData) => {
            const tournament = tournaments.find(
              (t) => t.id === performerData.tournamentId
            );
            return `
          <div class="tournament-item">
            <div class="tournament-info">
              <h5>Top Performers - ${
                tournament ? tournament.name : "Unknown Tournament"
              }</h5>
              ${
                performerData.performers
                  ? performerData.performers
                      .map(
                        (performer, index) =>
                          `<p>${getPositionIcon(index + 1)} ${
                            index + 1
                          }${getOrdinalSuffix(index + 1)}: ${performer.name} (${
                            performer.kills || 0
                          } kills, ${performer.playTime || "0m"} playtime)</p>`
                      )
                      .join("")
                  : ""
              }
              <p>Added: ${new Date(
                performerData.createdAt
              ).toLocaleDateString()}</p>
            </div>
            <div class="action-buttons">
              <button class="btn btn-danger btn-sm" onclick="deleteTopPerformers('${
                performerData.id
              }')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
          })
          .join("");
        // Render pagination
        renderAdminPagination(
          "performers-admin-pagination",
          performersAdminCurrentPage,
          topPerformers.length,
          changePerformersAdminPage,
          goToPerformersAdminPage
        );
      }
      function getPositionIcon(position) {
        switch (position) {
          case 1:
            return "🏆";
          case 2:
            return "🥈";
          case 3:
            return "🥉";
          default:
            return "🏅";
        }
      }
      function getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j == 1 && k != 11) return "st";
        if (j == 2 && k != 12) return "nd";
        if (j == 3 && k != 13) return "rd";
        return "th";
      }
      async function loadTournamentOptions() {
        const select = document.getElementById("resultTournamentId");
        if (!select) return;

        select.innerHTML = '<option value="">Select Tournament</option>';

        tournaments.forEach((tournament) => {
          const option = document.createElement("option");
          option.value = tournament.id;
          option.textContent = tournament.name;
          select.appendChild(option);
        });
      }
      async function loadPerformerTournamentOptions() {
        const select = document.getElementById("performersTournamentId");
        if (!select) return;

        select.innerHTML = '<option value="">Select Tournament</option>';

        tournaments.forEach((tournament) => {
          const option = document.createElement("option");
          option.value = tournament.id;
          option.textContent = tournament.name;
          select.appendChild(option);
        });
      }
      // Tournament Functions
      async function handleTournamentSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const tournamentData = {
          name: document.getElementById("tournamentName").value,
          prizePool: parseInt(document.getElementById("prizePool").value),
          entryFee: parseInt(document.getElementById("entryFee").value),
          maxSlots: parseInt(document.getElementById("maxSlots").value),
          gameMode: document.getElementById("gameMode").value,
          tournamentDate: document.getElementById("tournamentDate").value,
          registrationStartDate: document.getElementById(
            "registrationStartDate"
          ).value,
          registrationEndDate: document.getElementById("registrationEndDate")
            .value,
          status: document.getElementById("tournamentStatus").value,
          description: document.getElementById("description").value,
          imageUrl: document.getElementById("tournamentImageUrl").value,
          registeredTeams: 0,
          createdAt: new Date().toISOString(),
        };
        try {
          if (isEditMode) {
            const tournamentId =
              document.getElementById("editTournamentId").value;
            await db
              .collection("tournaments")
              .doc(tournamentId)
              .update(tournamentData);
            showMessage("Tournament updated successfully!", "success");
          } else {
            await db.collection("tournaments").add(tournamentData);
            showMessage("Tournament created successfully!", "success");
          }

          e.target.reset();
          document.getElementById("tournamentImagePreview").innerHTML = "";
          document.getElementById("tournamentImageUrl").value = "";
          cancelEdit();
          await loadTournaments();
          await updateStats();
          await loadTournamentOptions();
          await loadPerformerTournamentOptions();
        } catch (error) {
          console.error("Error saving tournament:", error);
          showMessage("Error saving tournament", "error");
        }
      }
      function editTournament(tournamentId) {
        const tournament = tournaments.find((t) => t.id === tournamentId);
        if (!tournament) return;
        // Fill form with tournament data
        document.getElementById("editTournamentId").value = tournamentId;
        document.getElementById("tournamentName").value = tournament.name;
        document.getElementById("prizePool").value = tournament.prizePool;
        document.getElementById("entryFee").value = tournament.entryFee;
        document.getElementById("maxSlots").value = tournament.maxSlots;
        document.getElementById("gameMode").value = tournament.gameMode;
        document.getElementById("tournamentDate").value =
          tournament.tournamentDate;
        document.getElementById("registrationStartDate").value =
          tournament.registrationStartDate || "";
        document.getElementById("registrationEndDate").value =
          tournament.registrationEndDate || "";
        document.getElementById("tournamentStatus").value = tournament.status;
        document.getElementById("description").value =
          tournament.description || "";
        document.getElementById("tournamentImageUrl").value =
          tournament.imageUrl || "";
        if (tournament.imageUrl) {
          document.getElementById(
            "tournamentImagePreview"
          ).innerHTML = `<img src="${tournament.imageUrl}" alt="Tournament Image" style="max-width: 200px; max-height: 150px; border-radius: 10px; object-fit: cover;">`;
        }
        // Update UI for edit mode
        isEditMode = true;
        document.getElementById("formTitle").textContent = "Edit Tournament";
        document.getElementById("submitBtn").innerHTML =
          '<i class="fas fa-save"></i> Update Tournament';
        document.getElementById("cancelBtn").style.display = "inline-block";
      }
      function cancelEdit() {
        isEditMode = false;
        document.getElementById("formTitle").textContent =
          "Create New Tournament";
        document.getElementById("submitBtn").innerHTML =
          '<i class="fas fa-plus"></i> Create Tournament';
        document.getElementById("cancelBtn").style.display = "none";
        document.getElementById("editTournamentId").value = "";
        document.getElementById("createTournamentForm").reset();
        document.getElementById("tournamentImagePreview").innerHTML = "";
        document.getElementById("tournamentImageUrl").value = "";
      }
      async function deleteTournament(tournamentId) {
        if (!confirm("Are you sure you want to delete this tournament?"))
          return;
        try {
          await db.collection("tournaments").doc(tournamentId).delete();
          showMessage("Tournament deleted successfully!", "success");
          await loadTournaments();
          await updateStats();
          await loadTournamentOptions();
          await loadPerformerTournamentOptions();
        } catch (error) {
          console.error("Error deleting tournament:", error);
          showMessage("Error deleting tournament", "error");
        }
      }
      async function deleteTeam(teamId) {
        if (!confirm("Are you sure you want to delete this team registration?"))
          return;
        try {
          const teamDoc = await db
            .collection("teamRegistrations")
            .doc(teamId)
            .get();
          const teamData = teamDoc.data();

          // Delete team
          await db.collection("teamRegistrations").doc(teamId).delete();

          // Update tournament registered count
          if (teamData.tournamentId) {
            await db
              .collection("tournaments")
              .doc(teamData.tournamentId)
              .update({
                registeredTeams: firebase.firestore.FieldValue.increment(-1),
              });
          }

          showMessage("Team deleted successfully!", "success");
          await loadTeams();
          await loadTournaments();
          await updateStats();
        } catch (error) {
          console.error("Error deleting team:", error);
          showMessage("Error deleting team", "error");
        }
      }
      // Results Functions
      function addTeamPosition() {
        teamPositionCount++;
        const teamsContainer = document.getElementById("teamsContainer");
        const teamPosition = document.createElement("div");
        teamPosition.className = "team-position";
        teamPosition.innerHTML = `
        <h6>🏅 ${teamPositionCount}${getOrdinalSuffix(
          teamPositionCount
        )} Place</h6>
        <div class="row">
          <div class="col-md-3">
            <input type="text" class="form-control" placeholder="Team Name" name="teamName" required>
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" placeholder="Points" name="points">
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" placeholder="Kills" name="kills">
          </div>
          <div class="col-md-3">
            <input type="number" class="form-control" placeholder="Prize (₹)" name="prize">
          </div>
        </div>
        <button type="button" class="btn btn-danger btn-sm mt-2" onclick="removeTeamPosition(this)">
          <i class="fas fa-times"></i> Remove Position
        </button>
      `;
        teamsContainer.appendChild(teamPosition);
      }
      function removeTeamPosition(button) {
        button.closest(".team-position").remove();
        teamPositionCount--;
      }
      async function handleAddResult(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const tournamentId =
          formData.get("resultTournamentId") ||
          document.getElementById("resultTournamentId").value;
        const completedDate =
          formData.get("completedDate") ||
          document.getElementById("completedDate").value;

        const teamNames = formData.getAll("teamName");
        const points = formData.getAll("points");
        const kills = formData.getAll("kills");
        const prizes = formData.getAll("prize");

        const teams = teamNames.map((name, index) => ({
          teamName: name,
          points: parseInt(points[index]) || 0,
          kills: parseInt(kills[index]) || 0,
          prize: parseInt(prizes[index]) || 0,
        }));

        const tournament = tournaments.find((t) => t.id === tournamentId);

        // Get top performers for this tournament if they exist
        let topPerformersData = [];
        try {
          const performersSnapshot = await db
            .collection("topPerformers")
            .where("tournamentId", "==", tournamentId)
            .limit(1)
            .get();

          if (!performersSnapshot.empty) {
            const performerDoc = performersSnapshot.docs[0].data();
            topPerformersData = performerDoc.performers || [];
          }
        } catch (error) {
          console.error("Error fetching top performers:", error);
        }

        const resultData = {
          tournamentId: tournamentId,
          tournamentName: tournament ? tournament.name : "Unknown",
          teamResults: teams, // ← Changed from 'teams' to 'teamResults'
          topPerformers: topPerformersData, // ← Added top performers
          completedDate: completedDate,
          imageUrl: tournament ? tournament.imageUrl : "",
          prizePool: tournament ? tournament.prizePool : 0,
          totalTeams: teams.length,
          winner: teams[0]?.teamName || "TBD",
          createdAt: new Date().toISOString(),
        };
        try {
          await db.collection("tournamentResults").add(resultData);
          showMessage("Tournament result added successfully!", "success");
          e.target.reset();
          teamPositionCount = 3;
          // Reset teams container to default 3 positions
          document.getElementById("teamsContainer").innerHTML = `
          <div class="team-position">
            <h6>🏆 1st Place</h6>
            <div class="row">
              <div class="col-md-3">
                <input type="text" class="form-control" placeholder="Team Name" name="teamName" required>
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Points" name="points">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Kills" name="kills">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Prize (₹)" name="prize">
              </div>
            </div>
          </div>
          <div class="team-position">
            <h6>🥈 2nd Place</h6>
            <div class="row">
              <div class="col-md-3">
                <input type="text" class="form-control" placeholder="Team Name" name="teamName" required>
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Points" name="points">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Kills" name="kills">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Prize (₹)" name="prize">
              </div>
            </div>
          </div>
          <div class="team-position">
            <h6>🥉 3rd Place</h6>
            <div class="row">
              <div class="col-md-3">
                <input type="text" class="form-control" placeholder="Team Name" name="teamName" required>
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Points" name="points">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Kills" name="kills">
              </div>
              <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Prize (₹)" name="prize">
              </div>
            </div>
          </div>
        `;
          await loadResults();
        } catch (error) {
          console.error("Error adding result:", error);
          showMessage("Error adding result", "error");
        }
      }
      async function deleteResult(resultId) {
        if (!confirm("Are you sure you want to delete this result?")) return;
        try {
          await db.collection("tournamentResults").doc(resultId).delete();
          showMessage("Result deleted successfully!", "success");
          await loadResults();
        } catch (error) {
          console.error("Error deleting result:", error);
          showMessage("Error deleting result", "error");
        }
      }
      // Top Performers Functions
      async function handleAddPerformers(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const tournamentId =
          formData.get("performersTournamentId") ||
          document.getElementById("performersTournamentId").value;

        const performerNames = formData.getAll("performerName");
        const performerKills = formData.getAll("performerKills"); // Changed from performerPoints
        const performerPlayTimes = formData.getAll("performerPlayTime"); // New field
        const performerImageUrls = formData.getAll("performerImageUrl");

        const performers = performerNames.map((name, index) => ({
          name: name,
          kills: parseInt(performerKills[index]) || 0, // Changed from points
          playTime: performerPlayTimes[index] || "0m", // New field
          imageUrl: performerImageUrls[index] || "",
        }));
        const tournament = tournaments.find((t) => t.id === tournamentId);

        const performersData = {
          tournamentId: tournamentId,
          tournamentName: tournament ? tournament.name : "Unknown",
          performers: performers,
          createdAt: new Date().toISOString(),
        };
        try {
          await db.collection("topPerformers").add(performersData);
          showMessage("Top performers added successfully!", "success");
          e.target.reset();
          // Clear image previews
          for (let i = 0; i < 5; i++) {
            document.getElementById(`performerPreview${i}`).innerHTML = "";
          }
          await loadTopPerformers();
        } catch (error) {
          console.error("Error adding top performers:", error);
          showMessage("Error adding top performers", "error");
        }
      }
      async function deleteTopPerformers(performersId) {
        if (!confirm("Are you sure you want to delete these top performers?"))
          return;
        try {
          await db.collection("topPerformers").doc(performersId).delete();
          showMessage("Top performers deleted successfully!", "success");
          await loadTopPerformers();
        } catch (error) {
          console.error("Error deleting top performers:", error);
          showMessage("Error deleting top performers", "error");
        }
      }
      // Utility Functions
      function showMessage(message, type = "success") {
        // Create and show a temporary message
        const messageDiv = document.createElement("div");
        messageDiv.className = `alert alert-${
          type === "success" ? "success" : "danger"
        } position-fixed`;
        messageDiv.style.cssText =
          "top: 20px; right: 20px; z-index: 9999; max-width: 300px;";
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        setTimeout(() => {
          messageDiv.remove();
        }, 3000);
      }
      function logout() {
        auth.signOut().then(() => {
          window.location.href = "login.html";
        });
      }

      // Create sample tournament for testing
      async function createSampleTournament() {
        try {
          const sampleTournament = {
            name: "BGMI Championship 2024",
            description:
              "Join the ultimate BGMI tournament experience! Compete with the best players across India for amazing prizes.",
            prizePool: 100000,
            maxSlots: 100,
            registeredTeams: 0,
            tournamentDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            registrationEndDate: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            gameMode: "Squads",
            map: "Erangel",
            createdAt: new Date().toISOString(),
            status: "upcoming",
            imageUrl:
              "https://cdn.shopify.com/s/files/1/0674/9614/9171/files/BGMI_Banner.jpg?v=1757497427",
          };

          const docRef = await db
            .collection("tournaments")
            .add(sampleTournament);
          console.log("Sample tournament created with ID:", docRef.id);
          await loadTournaments(); // Refresh the display
          showMessage("Sample tournament created successfully!", "success");
          return docRef.id;
        } catch (error) {
          console.error("Error creating sample tournament:", error);
          showMessage(
            "Error creating sample tournament: " + error.message,
            "error"
          );
          return null;
        }
      }

      // Debug function to check data
      async function debugData() {
        try {
          console.log("=== DEBUGGING ADMIN DATA ===");

          const tournamentsSnapshot = await db.collection("tournaments").get();
          console.log("Tournaments in database:", tournamentsSnapshot.size);
          tournamentsSnapshot.forEach((doc) => {
            console.log("Tournament:", doc.id, doc.data());
          });

          console.log("=== DEBUG COMPLETE ===");
        } catch (error) {
          console.error("Debug error:", error);
        }
      }

      // Create sample tournament result for testing
      async function createSampleResult() {
        try {
          const sampleResult = {
            tournamentName: "BGMI Championship 2024",
            tournamentId: "sample_tournament_id",
            completedDate: new Date().toISOString(),
            prizePool: 100000,
            totalTeams: 50,
            winner: "Team Alpha",
            imageUrl:
              "https://cdn.shopify.com/s/files/1/0674/9614/9171/files/BGMI_Banner.jpg?v=1757497427",
            teamResults: [
              { teamName: "Team Alpha", points: 150, kills: 45, prize: 50000 },
              { teamName: "Team Beta", points: 140, kills: 42, prize: 30000 },
              { teamName: "Team Gamma", points: 135, kills: 38, prize: 20000 },
              { teamName: "Team Delta", points: 130, kills: 35, prize: 0 },
              { teamName: "Team Epsilon", points: 125, kills: 32, prize: 0 },
            ],
            topPerformers: [
              {
                playerName: "ProPlayer1",
                ign: "PP1_IGN",
                teamName: "Team Alpha",
                kills: 15,
                damage: 2500,
              },
              {
                playerName: "ProPlayer2",
                ign: "PP2_IGN",
                teamName: "Team Beta",
                kills: 14,
                damage: 2400,
              },
              {
                playerName: "ProPlayer3",
                ign: "PP3_IGN",
                teamName: "Team Gamma",
                kills: 13,
                damage: 2300,
              },
            ],
          };

          const docRef = await db
            .collection("tournamentResults")
            .add(sampleResult);
          console.log("Sample tournament result created with ID:", docRef.id);
          await loadResults(); // Refresh the display
          showMessage(
            "Sample tournament result created successfully!",
            "success"
          );
          return docRef.id;
        } catch (error) {
          console.error("Error creating sample result:", error);
          showMessage(
            "Error creating sample result: " + error.message,
            "error"
          );
          return null;
        }
      }

      // Make functions available globally
      window.createSampleTournament = createSampleTournament;
      window.createSampleResult = createSampleResult;
      window.debugData = debugData;
    </script>

    <script>
      async function loadResultDetails(resultId) {
  try {
    console.log("🔍 Loading result details for ID:", resultId);

    const teamsTableElement = document.getElementById("teams-results-table");
    const performersGridElement = document.getElementById("top-performers-grid");
    
    if (!teamsTableElement || !performersGridElement) {
      console.error("❌ Required elements not found!");
      return;
    }

    // Show loading state
    teamsTableElement.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #00d4ff;"><i class="fas fa-spinner fa-spin"></i> Loading teams...</td></tr>';
    performersGridElement.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #00d4ff;"><i class="fas fa-spinner fa-spin"></i> Loading top performers...</div>';

    const doc = await db.collection("tournamentResults").doc(resultId).get();

    if (!doc.exists) {
      console.error("❌ Document not found for ID:", resultId);
      return;
    }

    const result = { id: doc.id, ...doc.data() };
    console.log("📊 Result data loaded:", result);

    // Update modal title
    const titleElement = document.getElementById("result-modal-title");
    if (titleElement) {
      titleElement.textContent = `${result.tournamentName || 'Tournament'} - Results`;
    }

    // Handle both 'teams' and 'teamResults' field names
    const teamResults = result.teamResults || result.teams || [];
    
    if (teamResults.length > 0) {
      console.log(`✅ Found ${teamResults.length} teams`);
      
      const teamsHTML = teamResults
        .map((team, index) => `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 15px; color: ${index < 3 ? "#ffd700" : "#ffffff"}; font-weight: 600;">
              ${index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
            </td>
            <td style="padding: 15px; color: #ffffff; font-weight: 600;">${team.teamName || 'Unknown Team'}</td>
            <td style="padding: 15px; text-align: center; color: #00d4ff; font-weight: 600;">${team.points || 0}</td>
            <td style="padding: 15px; text-align: center; color: #ff6b35; font-weight: 600;">${team.kills || 0}</td>
            <td style="padding: 15px; text-align: center; color: #28a745; font-weight: 600;">₹${(team.prize || 0).toLocaleString()}</td>
          </tr>
        `)
        .join("");
      
      teamsTableElement.innerHTML = teamsHTML;
    } else {
      teamsTableElement.innerHTML = '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #8892b0;">No team results available</td></tr>';
    }

    // Load top performers - check if they're in the result or need to be fetched separately
    let topPerformersData = result.topPerformers || [];
    
    if (topPerformersData.length === 0 && result.tournamentId) {
      // Try to fetch from separate collection
      try {
        const performersSnapshot = await db.collection('topPerformers')
          .where('tournamentId', '==', result.tournamentId)
          .limit(1)
          .get();
        
        if (!performersSnapshot.empty) {
          const performerDoc = performersSnapshot.docs[0].data();
          topPerformersData = performerDoc.performers || [];
        }
      } catch (error) {
        console.error('Error fetching top performers:', error);
      }
    }

    if (topPerformersData.length > 0) {
      console.log(`✅ Found ${topPerformersData.length} top performers`);
      
      const performersHTML = topPerformersData
        .map((performer, index) => `
          <div class="news-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.2); border-radius: 15px; padding: 20px; margin-bottom: 15px;">
            <div class="news-content">
              <h3 class="news-card-title" style="color: #00d4ff; margin-bottom: 10px; font-size: 1.2rem;">
                ${index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"} ${performer.playerName || performer.name || 'Unknown Player'}
              </h3>
              <div style="margin-bottom: 15px;">
                <p style="margin: 5px 0; color: #ffffff;"><strong style="color: #8892b0;">IGN:</strong> ${performer.ign || performer.name || 'N/A'}</p>
                <p style="margin: 5px 0; color: #ffffff;"><strong style="color: #8892b0;">Team:</strong> ${performer.teamName || 'N/A'}</p>
              </div>
              <div class="news-meta" style="display: flex; gap: 15px; flex-wrap: wrap;">
                <span style="color: #ff6b35; font-weight: 600;"><i class="fas fa-crosshairs"></i> ${performer.kills || 0} Kills</span>
                <span style="color: #28a745; font-weight: 600;"><i class="fas fa-fire"></i> ${performer.damage || performer.playTime || '0'}</span>
              </div>
            </div>
          </div>
        `)
        .join("");
      
      performersGridElement.innerHTML = performersHTML;
    } else {
      performersGridElement.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #8892b0;"><i class="fas fa-user-slash" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>No top performers data available</div>';
    }

  } catch (error) {
    console.error("❌ Error loading result details:", error);
    // Show error in UI
  }
}
    </script>
  </body>
</html>
