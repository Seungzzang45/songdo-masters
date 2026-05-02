// sondo_vote/public/vote.js
const MEMBERS = [
    "강성규", "김길용", "김대영", "김두환", "김용민", "김은묵", "김정규", "김정택", "김종천", "남기혁",
    "문홍권", "박다원", "박지훈79", "박지훈75", "배상필", "서경석", "서지우", "성종훈", "신승우", "심정수",
    "양희모", "오대성", "오성열", "오유근", "이광호", "이민형", "이성구", "이재희", "이필선", "임형준",
    "장원영", "정우전", "정일성", "조성민", "최성윤", "홍동훈"
];

let voteData = { polls: [] };
let isAdmin = false;
let currentTab = 'active';
let selectedMonth = '';
let expandedPolls = new Set();

const loader = document.getElementById('loader');
const tabs = document.getElementById('poll-tabs');
const pollsContainer = document.getElementById('polls-container');
const monthSelector = document.getElementById('month-selector');
const adminBtn = document.getElementById('admin-btn');
const adminPanel = document.getElementById('admin-panel');
const courseSelect = document.getElementById('poll-course');
const customCourseInput = document.getElementById('group-custom-course');
const optionsContainer = document.getElementById('options-container');

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

function setupEventListeners() {
    courseSelect.addEventListener('change', (e) => {
        if (e.target.value === '기타(직접입력)') {
            customCourseInput.style.display = 'block';
        } else {
            customCourseInput.style.display = 'none';
        }
    });

    document.getElementById('form-create').addEventListener('submit', handleCreatePoll);
}

async function loadData() {
    try {
        const res = await fetch('/api/vote/load');
        const data = await res.json();
        voteData = data.polls ? data : { polls: [] };
        
        checkAndCloseExpiredPolls();
        renderApp();
    } catch (e) {
        console.error('데이터 로드 실패:', e);
        voteData = { polls: [] };
        renderApp();
    }
}

async function saveData() {
    try {
        await fetch('/api/vote/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voteData)
        });
        return true;
    } catch (e) {
        console.error('데이터 저장 실패:', e);
        return false;
    }
}

function checkAndCloseExpiredPolls() {
    let changed = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    voteData.polls.forEach(poll => {
        if (poll.status === 'active') {
            const pollDate = new Date(poll.date);
            pollDate.setHours(0, 0, 0, 0);
            
            if (pollDate < today) {
                poll.status = 'closed';
                changed = true;
            }
        }
    });

    if (changed) saveData();
}

function renderApp() {
    loader.style.display = 'none';
    tabs.style.display = 'flex';
    renderTabs();
    renderPolls();
}

function renderTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.includes('진행중') && currentTab === 'active') tab.classList.add('active');
        if (tab.innerText.includes('지난') && currentTab === 'closed') tab.classList.add('active');
    });

    if (currentTab === 'closed') {
        monthSelector.style.display = 'flex';
        renderMonthSelector();
    } else {
        monthSelector.style.display = 'none';
    }
}

function switchTab(tabStr) {
    currentTab = tabStr;
    const closedMonths = getClosedMonths();
    if (tabStr === 'closed' && closedMonths.length > 0 && !selectedMonth) {
        selectedMonth = closedMonths[0].toString();
    }
    renderTabs();
    renderPolls();
}

function getClosedMonths() {
    const months = new Set();
    voteData.polls.forEach(p => {
        if (p.status === 'closed') months.add(p.month);
    });
    return Array.from(months).sort((a, b) => b - a);
}

function renderMonthSelector() {
    const months = getClosedMonths();
    monthSelector.innerHTML = '';
    
    if (months.length === 0) {
        monthSelector.style.display = 'none';
        return;
    }

    if (!months.includes(parseInt(selectedMonth)) && months.length > 0) {
        selectedMonth = months[0].toString();
    }

    months.forEach(m => {
        const btn = document.createElement('button');
        btn.className = `month-btn ${m.toString() === selectedMonth ? 'active' : ''}`;
        btn.innerText = `${m}월`;
        btn.onclick = () => {
            selectedMonth = m.toString();
            renderTabs();
            renderPolls();
        }
        monthSelector.appendChild(btn);
    });
}

function formatTimeToMMDDHHMM(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function getOptionColorClass(optName) {
    if (optName.includes('불참')) return 'status-color-red';
    if (optName === '대기') return 'status-color-gold';
    if (optName.includes('참석')) return 'status-color-green';
    return 'status-color-blue';
}

function renderPolls() {
    pollsContainer.innerHTML = '';
    
    let filtered = voteData.polls.filter(p => {
        if (currentTab === 'active') return p.status === 'active';
        return p.status === 'closed' && p.month.toString() === selectedMonth;
    });

    if (currentTab === 'active') {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (filtered.length === 0) {
        pollsContainer.innerHTML = `
            <div class="empty-state">
                <div class="icon">${currentTab === 'active' ? '⛳' : '📂'}</div>
                <p>해당하는 투표가 없습니다.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(poll => pollsContainer.appendChild(createPollCard(poll)));
}

function togglePollExpand(pollId) {
    if (expandedPolls.has(pollId)) {
        expandedPolls.delete(pollId);
    } else {
        expandedPolls.add(pollId);
    }
    renderPolls();
}

function openEditModal(e, pollId) {
    e.stopPropagation();
    const poll = voteData.polls.find(p => p.id === pollId);
    if (!poll) return;

    document.getElementById('edit-poll-id').value = pollId;
    document.getElementById('edit-poll-type').value = poll.type;

    const titleGroup = document.getElementById('edit-group-title');
    const titleInput = document.getElementById('edit-poll-title');
    if (poll.type === 'event') {
        titleGroup.style.display = 'block';
        titleInput.value = poll.title || '';
    } else {
        titleGroup.style.display = 'none';
    }

    document.getElementById('edit-poll-date').value = poll.date;
    document.getElementById('edit-poll-time').value = poll.time;

    const editCourseSelect = document.getElementById('edit-poll-course');
    const knownCourses = Array.from(editCourseSelect.options).map(o => o.value).filter(v => v !== '기타(직접입력)');
    if (knownCourses.includes(poll.course)) {
        editCourseSelect.value = poll.course;
        document.getElementById('edit-group-custom-course').style.display = 'none';
    } else {
        editCourseSelect.value = '기타(직접입력)';
        document.getElementById('edit-group-custom-course').style.display = 'block';
        document.getElementById('edit-poll-custom-course').value = poll.course;
    }

    document.getElementById('edit-poll-fee').value = poll.fee;
    document.getElementById('edit-poll-teams').value = poll.teams;

    document.getElementById('modal-edit').classList.add('active');
}

function toggleEditCustomCourse() {
    const val = document.getElementById('edit-poll-course').value;
    document.getElementById('edit-group-custom-course').style.display = val === '기타(직접입력)' ? 'block' : 'none';
}

async function handleEditPoll(e) {
    e.preventDefault();
    const pollId = document.getElementById('edit-poll-id').value;
    const poll = voteData.polls.find(p => p.id === pollId);
    if (!poll) return;

    if (poll.type === 'event') {
        const newTitle = document.getElementById('edit-poll-title').value.trim();
        if (newTitle) poll.title = newTitle;
    }
    poll.date = document.getElementById('edit-poll-date').value;
    poll.month = new Date(poll.date).getMonth() + 1;
    poll.time = document.getElementById('edit-poll-time').value;

    let course = document.getElementById('edit-poll-course').value;
    if (course === '기타(직접입력)') {
        course = document.getElementById('edit-poll-custom-course').value;
    }
    poll.course = course;
    poll.fee = document.getElementById('edit-poll-fee').value;
    poll.teams = document.getElementById('edit-poll-teams').value;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;

    if (await saveData()) {
        closeModal('modal-edit');
        showToast('수정되었습니다.');
        renderApp();
    } else {
        alert('저장에 실패했습니다.');
        btn.disabled = false;
    }
}

function createVoterGroupsHTML(poll, isClosed) {
    const groups = {};
    (poll.options || []).forEach(opt => { groups[opt] = []; });

    const votedSet = new Set(Object.keys(poll.votes));
    MEMBERS.forEach(memberName => {
        const v = poll.votes[memberName];
        if (v) {
            const opts = Array.isArray(v.option) ? v.option : [v.option];
            const key = opts.join('+');
            if (!groups[key]) groups[key] = [];
            groups[key].push(memberName);
        }
    });

    const pendingMembers = MEMBERS.filter(m => !votedSet.has(m));
    let html = '<div class="voter-groups">';

    for (const opt of (poll.options || [])) {
        if (!groups[opt] || groups[opt].length === 0) continue;
        const colorClass = getOptionColorClass(opt);
        const tags = groups[opt].map(name => !isClosed
            ? `<span class="voter-tag">${name}<button class="voter-tag-del" onclick="event.stopPropagation();deleteVote('${poll.id}','${name}')" title="투표 취소">×</button></span>`
            : `<span class="voter-tag">${name}</span>`
        ).join('');
        html += `<div class="voter-group">
            <span class="voter-group-label ${colorClass}">${opt} <strong>${groups[opt].length}</strong></span>
            <div class="voter-group-names">${tags}</div>
        </div>`;
    }

    if (pendingMembers.length > 0) {
        const tags = pendingMembers.map(name => `<span class="voter-tag muted">${name}</span>`).join('');
        html += `<div class="voter-group">
            <span class="voter-group-label status-color-muted">미투표 <strong>${pendingMembers.length}</strong></span>
            <div class="voter-group-names">${tags}</div>
        </div>`;
    }

    html += '</div>';
    return html;
}

function createPollCard(poll) {
    const card = document.createElement('div');
    const isExpanded = expandedPolls.has(poll.id);
    const isClosed = poll.status === 'closed';

    const badgeType = isClosed ? 'badge-closed' : (poll.type === 'regular' ? 'badge-regular' : 'badge-event');
    const badgeText = isClosed ? '마감됨' : (poll.type === 'regular' ? '정규 라운딩' : '이벤트 라운딩');
    const titleText = poll.title || `${new Date(poll.date).getMonth() + 1}월 정기라운딩`;

    card.className = `card glass poll-card ${poll.type} ${poll.status}`;

    // 통계 처리
    let optionCounts = {};
    (poll.options || []).forEach(opt => optionCounts[opt] = 0);
    const votedCount = Object.keys(poll.votes).length;
    Object.keys(poll.votes).forEach(name => {
        const v = poll.votes[name];
        const opts = Array.isArray(v.option) ? v.option : [v.option];
        opts.forEach(opt => {
            if (optionCounts[opt] !== undefined) optionCounts[opt]++;
            else optionCounts[opt] = 1;
        });
    });
    const pendingCount = MEMBERS.length - votedCount;

    // 요약 헤더용 미니 칩
    let miniChipsHTML = '';
    for (const opt in optionCounts) {
        if (optionCounts[opt] > 0) {
            miniChipsHTML += `<span class="mini-chip ${getOptionColorClass(opt)}">${optionCounts[opt]}</span>`;
        }
    }
    miniChipsHTML += `<span class="mini-chip status-color-muted">${pendingCount}</span>`;

    // 관리자 버튼
    const editBtnHTML = (isAdmin && !isClosed)
        ? `<button class="title-edit-btn" onclick="openEditModal(event,'${poll.id}')" title="정보 수정">✏️</button>` : '';
    let adminActionHTML = '';
    if (isAdmin && !isClosed) {
        adminActionHTML = `<button class="btn btn-sm" style="background:var(--text-muted);color:white;" onclick="event.stopPropagation();forceClosePoll('${poll.id}')">수동 마감</button>`;
    } else if (isAdmin && isClosed) {
        adminActionHTML = `<button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deletePoll('${poll.id}')">삭제</button>`;
    }

    // 전체 현황 요약 박스 (펼쳤을 때)
    let summaryHTML = '';
    for (const opt in optionCounts) {
        summaryHTML += `<div class="status-box ${getOptionColorClass(opt)}"><span class="status-num">${optionCounts[opt]}</span>${opt}</div>`;
    }
    summaryHTML += `<div class="status-box status-color-muted"><span class="status-num">${pendingCount}</span>미투표</div>`;

    // 댓글
    const commentsHTML = (poll.comments || []).length > 0
        ? (poll.comments || []).map(c => `
            <li class="comment-item">
                <div class="comment-header">
                    <span class="comment-name">${c.name}</span>
                    <span class="comment-time">${formatTimeToMMDDHHMM(c.timestamp)}</span>
                </div>
                <p class="comment-text">${c.text}</p>
            </li>`).join('')
        : '<li class="comment-empty">첫 댓글을 남겨보세요!</li>';

    const memberOptions = MEMBERS.map(m => `<option value="${m}">${m}</option>`).join('');
    const commentFormHTML = !isClosed ? `
        <form class="comment-form" onsubmit="submitComment(event, '${poll.id}')">
            <select id="comment-name-${poll.id}" class="form-control" required>
                <option value="" disabled selected>이름을 선택하세요</option>
                ${memberOptions}
            </select>
            <div class="comment-input-row">
                <input type="text" id="comment-text-${poll.id}" class="form-control" placeholder="댓글을 입력하세요" required>
                <button type="submit" class="btn btn-primary" style="width:auto;white-space:nowrap;">등록</button>
            </div>
        </form>` : '';

    card.innerHTML = `
        <div class="poll-summary-header" onclick="togglePollExpand('${poll.id}')">
            <div class="poll-summary-top">
                <div class="poll-summary-title-row">
                    <span class="badge ${badgeType}">${badgeText}</span>
                    <span class="poll-title-text">${titleText}</span>
                    ${editBtnHTML}
                    ${adminActionHTML ? `<span style="margin-left:auto;">${adminActionHTML}</span>` : ''}
                </div>
                <span class="expand-toggle">${isExpanded ? '▲' : '▼'}</span>
            </div>
            <div class="poll-summary-bottom">
                <span class="poll-summary-meta">${formatDateStr(poll.date)} ${poll.time} &middot; ${poll.course} &middot; ${parseInt(poll.fee).toLocaleString()}원 &middot; ${poll.teams}팀</span>
                <div class="mini-chips-row">${miniChipsHTML}</div>
            </div>
        </div>

        ${isExpanded ? `
        <div class="poll-expanded-content">
            ${!isClosed ? createVoteForm(poll) : ''}

            <div class="dashboard">
                <h3>투표 현황 (${votedCount}/${MEMBERS.length})</h3>
                <div class="status-summary">${summaryHTML}</div>
                ${createVoterGroupsHTML(poll, isClosed)}
            </div>

            <div class="comment-board">
                <h3 class="comment-board-title">💬 댓글</h3>
                <ul class="comment-list">${commentsHTML}</ul>
                ${commentFormHTML}
            </div>
        </div>
        ` : ''}
    `;

    return card;
}

function createVoteForm(poll) {
    const memberOptions = MEMBERS.map(m => `<option value="${m}">${m}</option>`).join('');

    let inputsHTML;
    if (poll.multiSelect) {
        inputsHTML = (poll.options || []).map((opt, idx) => `
            <div class="dynamic-radio-btn">
                <input type="checkbox" id="opt-${poll.id}-${idx}" name="status-${poll.id}" value="${opt}">
                <label for="opt-${poll.id}-${idx}">${opt}</label>
            </div>
        `).join('');
    } else {
        inputsHTML = (poll.options || []).map((opt, idx) => `
            <div class="dynamic-radio-btn">
                <input type="radio" id="opt-${poll.id}-${idx}" name="status-${poll.id}" value="${opt}" required onchange="toggleReasonInput('${poll.id}')">
                <label for="opt-${poll.id}-${idx}">${opt}</label>
            </div>
        `).join('');
    }

    const reasonGroupHTML = poll.multiSelect ? '' : `
        <div class="form-group" id="reason-group-${poll.id}" style="display:none;">
            <input type="text" id="vote-reason-${poll.id}" class="form-control" placeholder="비고란 (선택 사항)">
        </div>`;

    const multiNote = poll.multiSelect
        ? `<p style="font-size:0.8rem; color:var(--gold); margin:0 0 12px;">복수선택 가능</p>`
        : '';

    return `
        <div class="my-vote-box">
            <h3 style="margin-top:0; margin-bottom:8px; font-size:1.1rem;">나의 투표</h3>
            ${multiNote}
            <form onsubmit="submitVote(event, '${poll.id}')">
                <div class="form-group">
                    <select id="vote-name-${poll.id}" class="form-control" required>
                        <option value="" disabled selected>회원 이름을 선택하세요</option>
                        ${memberOptions}
                    </select>
                </div>

                <div class="dynamic-radio-group">
                    ${inputsHTML}
                </div>

                ${reasonGroupHTML}

                <button type="submit" class="btn btn-primary" style="margin-top:5px;">투표하기</button>
            </form>
        </div>
    `;
}

function toggleReasonInput(pollId) {
    // If "불참" is selected, require reason. For others, optional but show input if they want to leave memo.
    const form = document.querySelector(`form[onsubmit="submitVote(event, '${pollId}')"]`);
    const checkedRadio = form.querySelector(`input[name="status-${pollId}"]:checked`);
    const reasonGroup = document.getElementById(`reason-group-${pollId}`);
    const reasonInput = document.getElementById(`vote-reason-${pollId}`);
    
    if (checkedRadio) {
        reasonGroup.style.display = 'block';
        reasonInput.placeholder = "비고란 (선택 사항)";
        reasonInput.required = false;
    }
}

async function submitVote(e, pollId) {
    e.preventDefault();

    const form = e.target;
    const name = form.querySelector(`#vote-name-${pollId}`).value;

    const poll = voteData.polls.find(p => p.id === pollId);
    if (!poll) return;

    let selectedOption;
    if (poll.multiSelect) {
        const checked = Array.from(form.querySelectorAll(`input[name="status-${pollId}"]:checked`));
        if (checked.length === 0) {
            alert('최소 1개 이상 선택해주세요.');
            return;
        }
        selectedOption = checked.map(c => c.value);
    } else {
        const checkedRadio = form.querySelector(`input[name="status-${pollId}"]:checked`);
        if (!checkedRadio) return;
        selectedOption = checkedRadio.value;
    }

    const reason = poll.multiSelect ? '' : (form.querySelector(`#vote-reason-${pollId}`)?.value || '');

    poll.votes[name] = {
        option: selectedOption,
        reason: reason,
        timestamp: Date.now()
    };

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = '저장 중...';
    btn.disabled = true;

    if (await saveData()) {
        showToast('투표가 저장되었습니다!');
        renderApp();
    } else {
        alert('저장에 실패했습니다.');
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Admin Logic
function toggleAdmin() {
    if (isAdmin) {
        logoutAdmin();
    } else {
        const pwd = prompt("관리자 비밀번호를 입력하세요:");
        if (pwd === "1234") {
            isAdmin = true;
            adminBtn.classList.add('active');
            adminPanel.classList.add('active');
            renderApp();
        } else if (pwd !== null) {
            alert("비밀번호가 틀렸습니다.");
        }
    }
}

function logoutAdmin() {
    isAdmin = false;
    adminBtn.classList.remove('active');
    adminPanel.classList.remove('active');
    renderApp();
}

function getNextRegularRoundDate() {
    const today = new Date();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    
    let targetMonth = month;
    if (today.getDate() > 20) {
        targetMonth += 1;
        if (targetMonth > 12) {
            targetMonth = 1;
            year++;
        }
    }

    let wedCountTarget = targetMonth === 6 ? 2 : 1;
    let date = new Date(year, targetMonth - 1, 1);
    let wedCount = 0;
    while (date.getMonth() === targetMonth - 1) {
        if (date.getDay() === 3) { 
            wedCount++;
            if (wedCount === wedCountTarget) break;
        }
        date.setDate(date.getDate() + 1);
    }
    
    return date;
}

function openCreateModal(type) {
    const modal = document.getElementById('modal-create');
    document.getElementById('poll-type').value = type;
    
    const titleGroup = document.getElementById('group-title');
    const pollTitle = document.getElementById('poll-title');
    
    if (type === 'regular') {
        document.getElementById('modal-title').innerText = '정규 라운딩 셋업';
        titleGroup.style.display = 'none';
        pollTitle.removeAttribute('required');
        
        const targetDate = getNextRegularRoundDate();
        document.getElementById('poll-date').value = targetDate.toISOString().split('T')[0];
        document.getElementById('poll-time').value = '13:00';
        courseSelect.value = '클럽72 하늘코스';
        customCourseInput.style.display = 'none';
        
    } else {
        document.getElementById('modal-title').innerText = '이벤트 라운딩 셋업';
        titleGroup.style.display = 'block';
        pollTitle.setAttribute('required', 'true');
        pollTitle.value = '';
        
        document.getElementById('poll-date').value = '';
        courseSelect.value = '골프존카운티 송도'; // Default for events as per user request example
    }
    
    // Setup dynamic options with defaults
    optionsContainer.innerHTML = '';
    let defaults = type === 'event' ? ["참석", "불참", "라운딩만 참석", "뒷풀이만 참석", "대기"] : ["참석", "불참", "대기"];
    defaults.forEach(opt => addOptionField(opt));

    modal.classList.add('active');
}

function addOptionField(val = '') {
    const div = document.createElement('div');
    div.className = 'option-row';
    div.innerHTML = `
        <input type="text" class="form-control" name="custom_option" value="${val}" placeholder="예: 참석" required>
        <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">X</button>
    `;
    optionsContainer.appendChild(div);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

async function handleCreatePoll(e) {
    e.preventDefault();
    
    const type = document.getElementById('poll-type').value;
    const title = document.getElementById('poll-title').value;
    const dateStr = document.getElementById('poll-date').value;
    const time = document.getElementById('poll-time').value;
    
    let course = courseSelect.value;
    if (course === '기타(직접입력)') {
        course = document.getElementById('poll-custom-course').value;
    }
    
    const fee = document.getElementById('poll-fee').value;
    const teams = document.getElementById('poll-teams').value;
    
    const opts = Array.from(document.querySelectorAll('input[name="custom_option"]'))
                  .map(ip => ip.value.trim())
                  .filter(v => v.length > 0);

    if (opts.length === 0) {
        alert('최소 1개 이상의 투표 항목이 필요합니다.');
        return;
    }

    const mDate = new Date(dateStr);
    
    const newPoll = {
        id: Date.now().toString(),
        type: type,
        title: type === 'event' ? title : null,
        month: mDate.getMonth() + 1,
        date: dateStr,
        course: course,
        time: time,
        fee: fee,
        teams: teams,
        options: opts,
        multiSelect: document.getElementById('poll-allow-revote').checked,
        status: 'active',
        votes: {}
    };
    
    voteData.polls.push(newPoll);
    
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    
    if (await saveData()) {
        closeModal('modal-create');
        showToast('투표가 생성되었습니다!');
        renderApp();
    } else {
        alert('생성에 실패했습니다.');
    }
    
    btn.disabled = false;
}

async function forceClosePoll(id) {
    if (!confirm('투표를 강제로 마감하시겠습니까?')) return;
    
    const poll = voteData.polls.find(p => p.id === id);
    if (poll) {
        poll.status = 'closed';
        if (await saveData()) {
            showToast('마감 처리되었습니다.');
            renderApp();
        }
    }
}

async function deletePoll(id) {
    if (!confirm('정말 이 투표 내역을 삭제하시겠습니까?')) return;
    
    voteData.polls = voteData.polls.filter(p => p.id !== id);
    if (await saveData()) {
        showToast('삭제되었습니다.');
        const closed = getClosedMonths();
        if (!closed.includes(parseInt(selectedMonth)) && closed.length > 0) {
            selectedMonth = closed[0].toString();
        }
        renderApp();
    }
}

async function submitComment(e, pollId) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector(`#comment-name-${pollId}`).value;
    const text = form.querySelector(`#comment-text-${pollId}`).value.trim();
    if (!text) return;

    const poll = voteData.polls.find(p => p.id === pollId);
    if (!poll) return;

    if (!poll.comments) poll.comments = [];
    poll.comments.push({ name, text, timestamp: Date.now() });

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    if (await saveData()) {
        showToast('댓글이 등록되었습니다.');
        renderApp();
    } else {
        btn.disabled = false;
    }
}

async function deleteVote(pollId, memberName) {
    const poll = voteData.polls.find(p => p.id === pollId);
    if (!poll) return;
    delete poll.votes[memberName];
    if (await saveData()) {
        showToast(`${memberName}님의 투표가 취소되었습니다.`);
        renderApp();
    }
}

function formatDateStr(dateStr) {
    const d = new Date(dateStr);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getMonth()+1}월 ${d.getDate()}일(${dayNames[d.getDay()]})`;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
