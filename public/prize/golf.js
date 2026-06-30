// --- 데이터 설정 ---
const members = [
    "강성규", "김길용", "김대영", "김두환", "김용민", "김은묵", "김정규", "김정택", "김종천", "남기혁",
    "문홍권", "박다원", "박지훈79", "박지훈75", "배상필", "배현호", "서경석", "서지우", "성종훈", "신승우", "심정수",
    "양희모", "오대성", "오성열", "오유근", "이광호", "이민형", "이성구", "이재희", "이필선", "임형준",
    "장원영", "정우전", "정일성", "조성민", "최성윤", "홍동훈"
];

function getPresetMarch() {
    return {
        sponsors: [
            { id: 301, name: "남기혁", item: "상품권 5만원 (전반전)" },
            { id: 302, name: "남기혁", item: "상품권 5만원 (후반전)" },
            { id: 303, name: "박지훈(75)", item: "공진단세트 (신페 5등)" },
            { id: 3031, name: "박지훈(75)", item: "공진단세트 (신페 18등)" },
            { id: 304, name: "김길용", item: "와규프리미엄세트" },
            { id: 305, name: "신승우", item: "연태고량주" },
            { id: 306, name: "정우전", item: "1865와인 2병" },
            { id: 307, name: "최성윤", item: "닷사이23" },
            { id: 308, name: "오유근", item: "PXG 웨지" },
            { id: 309, name: "양희모", item: "상품권 5만원 (니어리스트)" },
            { id: 3091, name: "양희모", item: "상품권 5만원 (롱기스트)" },
            { id: 310, name: "이광호", item: "타이틀리스트 1더즌+메달리스트 기념사진" }
        ],
        awards: [
            { id: 1,  title: "MEDALLIST",                              source: "dues",    prize: "타이틀리스트1더즌+자켓+마스터즈마커",    sponsorName: "회비",        winner: "" },
            { id: 2,  title: "힘내요상 (가장많이지신분)",               source: "sponsor", prize: "타이틀리스트 1더즌+메달리스트 기념사진", sponsorName: "이광호",      sponsorId: 310,  winner: "" },
            { id: 3,  title: "전반전 여포상 (전반 9홀 1등)",            source: "sponsor", prize: "상품권 5만원",                           sponsorName: "남기혁",      sponsorId: 301,  winner: "" },
            { id: 4,  title: "후반전 여포상 (후반 9홀 1등)",            source: "sponsor", prize: "상품권 5만원",                           sponsorName: "남기혁",      sponsorId: 302,  winner: "" },
            { id: 5,  title: "신페 1등",                               source: "dues",    prize: "테일러메이드 파우치",                     sponsorName: "회비",        winner: "" },
            { id: 6,  title: "신페 3등",                               source: "dues",    prize: "타이틀리스트 모자",                       sponsorName: "회비",        winner: "" },
            { id: 7,  title: "신페 5등",                               source: "sponsor", prize: "공진단세트",                              sponsorName: "박지훈(75)",  sponsorId: 303,  winner: "" },
            { id: 8,  title: "신페 8등",                               source: "dues",    prize: "타이틀리스트 모자",                       sponsorName: "회비",        winner: "" },
            { id: 9,  title: "신페 10등",                              source: "sponsor", prize: "와규프리미엄세트",                        sponsorName: "김길용",      sponsorId: 304,  winner: "" },
            { id: 10, title: "신페 13등",                              source: "sponsor", prize: "연태고량주",                              sponsorName: "신승우",      sponsorId: 305,  winner: "" },
            { id: 11, title: "신페 15등",                              source: "dues",    prize: "라면세트 1박스",                          sponsorName: "회비",        winner: "" },
            { id: 12, title: "신페 18등",                              source: "sponsor", prize: "공진단세트",                              sponsorName: "박지훈(75)",  sponsorId: 3031, winner: "" },
            { id: 13, title: "신페 20등",                              source: "sponsor", prize: "1865와인 2병",                           sponsorName: "정우전",      sponsorId: 306,  winner: "" },
            { id: 14, title: "신페 23등",                              source: "dues",    prize: "스탠리 텀블러",                           sponsorName: "회비",        winner: "" },
            { id: 15, title: "신페 25등",                              source: "sponsor", prize: "닷사이23",                                sponsorName: "최성윤",      sponsorId: 307,  winner: "" },
            { id: 16, title: "다파상",                                 source: "dues",    prize: "상품권 3만원",                            sponsorName: "회비",        winner: "" },
            { id: 17, title: "다보기상",                               source: "dues",    prize: "상품권 3만원",                            sponsorName: "회비",        winner: "" },
            { id: 18, title: "다더블상",                               source: "dues",    prize: "상품권 3만원",                            sponsorName: "회비",        winner: "" },
            { id: 19, title: "다양파상",                               source: "dues",    prize: "양파즙",                                  sponsorName: "회비",        winner: "" },
            { id: 20, title: "행운상 (경기운영장올이겨라/중복시상가능)", source: "sponsor", prize: "PXG 웨지",                              sponsorName: "오유근",      sponsorId: 308,  winner: "" },
            { id: 21, title: "니어리스트",                             source: "sponsor", prize: "상품권 5만원",                           sponsorName: "양희모",      sponsorId: 309,  winner: "" },
            { id: 22, title: "롱기스트",                               source: "sponsor", prize: "상품권 5만원",                           sponsorName: "양희모",      sponsorId: 3091, winner: "" },
            { id: 23, title: "참가상",                                 source: "dues",    prize: "볼빅 골프공1더즌",                        sponsorName: "회비",        winner: "" }
        ]
    };
}

function getPresetApril() {
    return {
        sponsors: [
            { id: 401,  name: "박지훈(75)", item: "공진단 세트" },
            { id: 402,  name: "최성윤",     item: "닷사이23/닷사이39 각 1병씩 세트" },
            { id: 403,  name: "김길용",     item: "와규프리미엄세트 (신페 8등)" },
            { id: 4031, name: "김길용",     item: "와규프리미엄세트 (신페 25등)" },
            { id: 404,  name: "김대영",     item: "골프 선글라스" },
            { id: 405,  name: "신승우",     item: "향수 3종세트" },
            { id: 406,  name: "박지훈(79)", item: "참기름" },
            { id: 407,  name: "정일성",     item: "타이틀리스트 1더즌" }
        ],
        awards: [
            { id: 1,  title: "MEDALLIST",                    source: "dues",    prize: "타이틀리스트1더즌+자켓+마스터즈마커",  sponsorName: "회비",        winner: "" },
            { id: 2,  title: "힘내요상 (가장많이 치신분)",   source: "dues",    prize: "상품권5만원+메달리스트 기념사진",      sponsorName: "회비",        winner: "" },
            { id: 3,  title: "신페 1등",                     source: "dues",    prize: "타이틀리스트 모자",                    sponsorName: "회비",        winner: "" },
            { id: 4,  title: "신페 3등",                     source: "dues",    prize: "테일러메이드 파우치",                  sponsorName: "회비",        winner: "" },
            { id: 5,  title: "신페 5등",                     source: "sponsor", prize: "공진단 세트",                          sponsorName: "박지훈(75)",  sponsorId: 401,  winner: "" },
            { id: 6,  title: "신페 8등",                     source: "sponsor", prize: "와규프리미엄세트",                     sponsorName: "김길용",      sponsorId: 403,  winner: "" },
            { id: 7,  title: "신페 10등",                    source: "sponsor", prize: "닷사이23/닷사이39 각 1병씩 세트",     sponsorName: "최성윤",      sponsorId: 402,  winner: "" },
            { id: 8,  title: "신페 13등",                    source: "sponsor", prize: "골프 선글라스",                        sponsorName: "김대영",      sponsorId: 404,  winner: "" },
            { id: 9,  title: "신페 15등",                    source: "dues",    prize: "타이틀리스트 모자",                    sponsorName: "회비",        winner: "" },
            { id: 10, title: "신페 18등",                    source: "sponsor", prize: "향수 3종세트",                         sponsorName: "신승우",      sponsorId: 405,  winner: "" },
            { id: 11, title: "신페 20등",                    source: "dues",    prize: "스탠리 텀블러",                        sponsorName: "회비",        winner: "" },
            { id: 12, title: "신페 23등",                    source: "dues",    prize: "라면세트 1박스",                       sponsorName: "회비",        winner: "" },
            { id: 13, title: "신페 25등",                    source: "sponsor", prize: "와규프리미엄세트",                     sponsorName: "김길용",      sponsorId: 4031, winner: "" },
            { id: 14, title: "다버디상",                     source: "dues",    prize: "상품권 5만원",                         sponsorName: "회비",        winner: "" },
            { id: 15, title: "다파상",                       source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 16, title: "다보기상",                     source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 17, title: "다더블상",                     source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 18, title: "다양파상",                     source: "dues",    prize: "양파즙",                               sponsorName: "회비",        winner: "" },
            { id: 19, title: "회장님을 이겨라 (가위바위보)", source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 20, title: "니어리스트 1등",               source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 21, title: "니어리스트 3등",               source: "sponsor", prize: "타이틀리스트 1더즌",                   sponsorName: "정일성",      sponsorId: 407,  winner: "" },
            { id: 22, title: "롱기스트",                     source: "dues",    prize: "상품권 3만원",                         sponsorName: "회비",        winner: "" },
            { id: 23, title: "참가상",                       source: "sponsor", prize: "참기름",                               sponsorName: "박지훈(79)",  sponsorId: 406,  winner: "" },
            { id: 24, title: "참가상",                       source: "dues",    prize: "골프우산",                             sponsorName: "회비",        winner: "" },
            { id: 25, title: "참가상",                       source: "dues",    prize: "볼빅 골프공1더즌",                     sponsorName: "회비",        winner: "" }
        ]
    };
}

// 상태 변수
function getFirstWednesday(year, month) {
    const date = new Date(year, month - 1, 1);
    const daysUntilWed = (3 - date.getDay() + 7) % 7;
    return new Date(year, month - 1, 1 + daysUntilWed);
}

function getActiveMonth() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    for (let m = 5; m <= 11; m++) {
        if (today <= getFirstWednesday(year, m)) return m;
    }
    return 11;
}

let activeMonth = getActiveMonth();
let isAdmin = false;
const ADMIN_PASSWORD = '1234';
let appData = {};

// --- API 저장/로드 ---
async function saveData() {
    try {
        const res = await fetch('/api/golf/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error('저장 실패 (서버 응답):', res.status, errText);
            alert(`⚠️ 저장 실패 (${res.status})\n${errText}\n\n잠시 후 다시 시도해주세요.`);
            return false;
        }
        return true;
    } catch (e) {
        console.error('저장 실패 (네트워크):', e);
        alert('⚠️ 서버 연결 실패\n인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.');
        return false;
    }
}

async function loadData() {
    try {
        const res = await fetch('/api/golf/load');
        if (!res.ok) {
            console.error('로드 실패 (서버 응답):', res.status);
            return null;
        }
        const parsed = JSON.parse(await res.text());
        if (parsed && Object.keys(parsed).length > 0) return parsed;
    } catch (e) {
        console.error('로드 실패:', e);
    }
    return null;
}

const currentMonthLabels = document.querySelectorAll('.current-month-label');
const monthSelector = document.getElementById('month-selector');
const listSponsors = document.getElementById('list-sponsors');
const sponsorCount = document.getElementById('sponsor-count');
const listAwards = document.getElementById('list-awards');
const selectSponsorName = document.getElementById('sponsor-name');

// --- 관리자 모드 ---
window.toggleAdmin = function() {
    if (isAdmin) {
        isAdmin = false;
        document.body.classList.remove('is-admin');
        document.getElementById('admin-toggle').textContent = '🔒';
        renderAll();
    } else {
        const pswd = prompt('관리자(총무) 비밀번호를 입력하세요.\n(초기 비밀번호: 1234)');
        if (pswd === ADMIN_PASSWORD) {
            isAdmin = true;
            document.body.classList.add('is-admin');
            document.getElementById('admin-toggle').textContent = '🔓';
            alert('관리자 모드로 전환되었습니다.');
            renderAll();
        } else if (pswd !== null) {
            alert('비밀번호가 틀렸습니다.');
        }
    }
}

// --- 초기화 ---
async function init() {
    const loaded = await loadData();
    if (loaded) {
        appData = loaded;
    } else {
        for (let m = 3; m <= 11; m++) {
            if (m === 3) appData[m] = getPresetMarch();
            else if (m === 4) appData[m] = getPresetApril();
            else appData[m] = { sponsors: [], awards: [] };
        }
        await saveData();
    }

    // 기존 찬조 내역을 시상관리로 일괄 자동 반영 (이미 연결된 것은 건너뜀)
    let synced = false;
    for (let m = 3; m <= 11; m++) {
        if (syncSponsorAwards(m)) synced = true;
    }
    if (synced) await saveData();

    for (let m = 3; m <= 11; m++) {
        const btn = document.createElement('button');
        btn.className = `month-btn ${m === activeMonth ? 'active' : ''}`;
        btn.textContent = `${m}월`;
        btn.onclick = () => setMonth(m);
        monthSelector.appendChild(btn);
    }
    const activeBtn = monthSelector.querySelector('.month-btn.active');
    if (activeBtn) {
        monthSelector.scrollLeft = activeBtn.offsetLeft - (monthSelector.offsetWidth / 2) + (activeBtn.offsetWidth / 2);
    }

    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        selectSponsorName.appendChild(option);
    });

    document.getElementById('form-sponsor').addEventListener('submit', handleSponsorSubmit);
    renderAll();
}

function setMonth(m) {
    activeMonth = m;
    document.querySelectorAll('.month-btn').forEach(b => {
        b.classList.toggle('active', b.textContent === `${m}월`);
    });
    renderAll();
}

function renderAll() {
    currentMonthLabels.forEach(el => el.textContent = activeMonth);
    renderSponsors();
    renderAwards();
}

// --- 찬조 ---
async function handleSponsorSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('sponsor-name').value;
    const item = document.getElementById('sponsor-item').value;
    if (!name || !item) return;
    appData[activeMonth].sponsors.push({ id: Date.now(), name, item });
    syncSponsorAwards(activeMonth);
    await saveData();
    document.getElementById('sponsor-item').value = '';
    selectSponsorName.value = '';
    renderAll();
}

function renderSponsors() {
    const sponsors = appData[activeMonth].sponsors;
    listSponsors.innerHTML = '';
    sponsorCount.textContent = sponsors.length;
    if (sponsors.length === 0) {
        listSponsors.innerHTML = '<li class="sponsor-item" style="justify-content:center;color:#6b8270;">조회된 찬조가 없습니다.</li>';
        return;
    }
    [...sponsors].reverse().forEach(sponsor => {
        const li = document.createElement('li');
        li.className = 'sponsor-item';
        li.dataset.id = sponsor.id;
        // 수정 버튼: 모든 회원 / 삭제 버튼: 관리자만
        const editBtnHtml = `<button type="button" class="edit-btn" onclick="editSponsor(${sponsor.id})" title="수정" style="background:none;border:none;color:#a07830;font-size:16px;padding:0 8px;cursor:pointer;">✏️</button>`;
        const deleteBtnHtml = isAdmin ? `<button type="button" class="delete-btn" onclick="deleteSponsor(${sponsor.id})">×</button>` : '';
        li.innerHTML = `
            <div style="flex:1;min-width:0;">
                <div class="name">${sponsor.name}${isAdmin ? ` <span style="font-size:12px;font-weight:normal;color:#6b8270;">(ID: ${sponsor.id.toString().slice(-4)})</span>` : ''}</div>
                <div class="item">${sponsor.item}</div>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
                ${editBtnHtml}
                ${deleteBtnHtml}
            </div>
        `;
        listSponsors.appendChild(li);
    });
}

window.editSponsor = async function(id) {
    const sponsor = appData[activeMonth].sponsors.find(s => s.id === id);
    if (!sponsor) return;

    const li = document.querySelector(`.sponsor-item[data-id="${id}"]`);
    if (!li) return;

    // 회원 선택 옵션 만들기
    const nameOptions = members.map(m =>
        `<option value="${m}" ${sponsor.name === m ? 'selected' : ''}>${m}</option>`
    ).join('');
    // 기존 이름이 회원 목록에 없을 수도 있으므로 보존
    const extraNameOption = !members.includes(sponsor.name)
        ? `<option value="${sponsor.name}" selected>${sponsor.name}</option>` : '';

    li.innerHTML = `
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px;">
            <select class="edit-name-input" style="padding:8px;border-radius:8px;border:1px solid var(--glass-border);background:#f7faf8;color:#1a2e1a;font-size:14px;">
                ${extraNameOption}${nameOptions}
            </select>
            <input type="text" class="edit-item-input" value="${sponsor.item.replace(/"/g, '&quot;')}" style="padding:8px;border-radius:8px;border:1px solid var(--gold);background:#f7faf8;color:#1a2e1a;font-size:14px;">
        </div>
        <div style="display:flex;align-items:center;gap:4px;">
            <button type="button" onclick="saveSponsorEdit(${id})" title="저장" style="background:none;border:none;color:#4caf50;font-size:18px;padding:0 8px;cursor:pointer;">✓</button>
            <button type="button" onclick="renderSponsors()" title="취소" style="background:none;border:none;color:#c0392b;font-size:18px;padding:0 8px;cursor:pointer;">✕</button>
        </div>
    `;
    li.querySelector('.edit-item-input').focus();
}

window.saveSponsorEdit = async function(id) {
    const sponsor = appData[activeMonth].sponsors.find(s => s.id === id);
    if (!sponsor) return;
    const li = document.querySelector(`.sponsor-item[data-id="${id}"]`);
    if (!li) return;

    const newName = li.querySelector('.edit-name-input').value.trim();
    const newItem = li.querySelector('.edit-item-input').value.trim();
    if (!newName || !newItem) {
        alert('이름과 찬조 물품을 모두 입력하세요.');
        return;
    }

    sponsor.name = newName;
    const oldItem = sponsor.item;
    sponsor.item = newItem;

    // 연결된 시상 항목의 prize/sponsorName도 자동 업데이트
    appData[activeMonth].awards.forEach(a => {
        if (a.sponsorId === id) {
            a.prize = newItem;
            a.sponsorName = newName;
        }
    });

    await saveData();
    renderAll();
}

window.deleteSponsor = async function(id) {
    if (confirm('찬조 내역을 삭제하시겠습니까?\n(자동 연결된 시상 항목도 함께 삭제됩니다.)')) {
        appData[activeMonth].sponsors = appData[activeMonth].sponsors.filter(s => s.id !== id);
        appData[activeMonth].awards = appData[activeMonth].awards.filter(a => a.sponsorId !== id);
        await saveData();
        renderAll();
    }
}

// 찬조 → 시상 자동 동기화: 해당 월의 찬조 중 아직 시상에 연결되지 않은 항목을 시상 카드로 자동 생성
function syncSponsorAwards(month) {
    const data = appData[month];
    if (!data || !Array.isArray(data.sponsors) || !Array.isArray(data.awards)) return false;
    const linked = new Set(
        data.awards.filter(a => a.source === 'sponsor' && a.sponsorId != null).map(a => a.sponsorId)
    );
    let changed = false;
    let seq = 0;
    data.sponsors.forEach(s => {
        if (!linked.has(s.id)) {
            data.awards.push({
                id: Date.now() + (seq++),
                title: '찬조 시상',
                source: 'sponsor',
                prize: s.item,
                sponsorName: s.name,
                sponsorId: s.id,
                winner: ''
            });
            linked.add(s.id);
            changed = true;
        }
    });
    return changed;
}

// --- 시상 ---
function renderAwards() {
    const awards = appData[activeMonth].awards;
    listAwards.innerHTML = '';
    if (awards.length === 0) {
        listAwards.innerHTML = '<div style="color:#6b8270;text-align:center;padding:20px;">설정된 시상 항목이 없습니다.</div>';
        return;
    }
    awards.forEach(award => {
        const div = document.createElement('div');
        div.className = 'award-card';
        let selectHtml = '';
        if (isAdmin) {
            selectHtml = `<select class="winner-select" style="margin-top:10px;" onchange="updateAwardWinner(${award.id}, this.value)">
                <option value="">🏆 수상자 선택 (미지정)</option>`;
            members.forEach(m => {
                selectHtml += `<option value="${m}" ${award.winner === m ? 'selected' : ''}>${m}</option>`;
            });
            selectHtml += `</select>`;
        } else {
            selectHtml = `<div class="mt-3" style="color:var(--gold-light);font-weight:bold;font-size:15px;">
                🏆 수상자: <span style="color:#1a2e1a;margin-left:5px;">${award.winner || '<span style="color:#6b8270;font-weight:normal;">(미지정)</span>'}</span>
            </div>`;
        }
        const actionHtml = isAdmin ? `
            <div class="award-actions">
                <button class="icon-btn" onclick="editAward(${award.id})">✏️</button>
                <button class="icon-btn delete" onclick="deleteAward(${award.id})">×</button>
            </div>` : '';
        div.innerHTML = `
            <div class="award-header">
                <span class="award-title">${award.title}</span>
                ${actionHtml}
            </div>
            <div class="award-body">
                <div>
                    <div class="award-prize">🎁 ${award.prize}</div>
                    <div class="award-sponsor">🤝 제공: ${award.sponsorName}</div>
                </div>
                ${selectHtml}
            </div>
        `;
        listAwards.appendChild(div);
    });
}

window.updateAwardWinner = async function(awardId, winner) {
    const award = appData[activeMonth].awards.find(a => a.id === awardId);
    if (award) { award.winner = winner; await saveData(); }
}

window.deleteAward = async function(id) {
    if (confirm('이 시상 항목을 삭제할까요?')) {
        appData[activeMonth].awards = appData[activeMonth].awards.filter(a => a.id !== id);
        await saveData();
        renderAwards();
    }
}

// --- 모달 ---
const modalAddAward = document.getElementById('modal-add-award');
const sponsorSelect = document.getElementById('award-sponsor-select');

window.openAddAwardModal = function() {
    if (!isAdmin) return;
    document.getElementById('award-title').value = '';
    document.getElementById('award-prize').value = '';
    document.querySelector('input[name="award-source"][value="dues"]').checked = true;
    document.getElementById('edit-award-id').value = '';
    toggleSourceInput();
    populateSponsorSelect();
    modalAddAward.classList.add('active');
}

window.closeAddAwardModal = function() { modalAddAward.classList.remove('active'); }

window.toggleSourceInput = function() {
    const source = document.querySelector('input[name="award-source"]:checked').value;
    document.getElementById('group-dues').style.display = source === 'dues' ? 'block' : 'none';
    document.getElementById('group-sponsor').style.display = source === 'sponsor' ? 'block' : 'none';
}

function populateSponsorSelect() {
    sponsorSelect.innerHTML = '<option value="" disabled selected>찬조품을 선택하세요</option>';
    appData[activeMonth].sponsors.forEach(s => {
        const op = document.createElement('option');
        op.value = s.id;
        op.textContent = `[${s.name}] ${s.item}`;
        sponsorSelect.appendChild(op);
    });
}

window.editAward = function(id) {
    if (!isAdmin) return;
    const award = appData[activeMonth].awards.find(a => a.id === id);
    if (!award) return;
    document.getElementById('award-title').value = award.title;
    document.getElementById('edit-award-id').value = award.id;
    if (award.source === 'sponsor') {
        document.querySelector('input[name="award-source"][value="sponsor"]').checked = true;
        toggleSourceInput();
        populateSponsorSelect();
        sponsorSelect.value = award.sponsorId || "";
    } else {
        document.querySelector('input[name="award-source"][value="dues"]').checked = true;
        toggleSourceInput();
        document.getElementById('award-prize').value = award.prize;
    }
    modalAddAward.classList.add('active');
}

window.saveAward = async function() {
    const title = document.getElementById('award-title').value.trim();
    if (!title) { alert('시상 타이틀을 입력하세요.'); return; }
    const source = document.querySelector('input[name="award-source"]:checked').value;
    let prize = '', sponsorName = '', sponsorId = null;
    if (source === 'dues') {
        prize = document.getElementById('award-prize').value.trim();
        sponsorName = '회비';
        if (!prize) { alert('상품 내용을 입력하세요.'); return; }
    } else {
        const sId = sponsorSelect.value;
        if (!sId) { alert('연결할 찬조품을 선택하세요.'); return; }
        const sData = appData[activeMonth].sponsors.find(s => s.id == sId);
        if (!sData) { alert('유효하지 않은 찬조품입니다.'); return; }
        sponsorId = sData.id; prize = sData.item; sponsorName = sData.name;
    }
    const editId = document.getElementById('edit-award-id').value;
    if (editId) {
        const target = appData[activeMonth].awards.find(a => a.id == editId);
        Object.assign(target, { title, source, prize, sponsorName, sponsorId });
    } else {
        appData[activeMonth].awards.push({ id: Date.now(), title, source, prize, sponsorName, sponsorId, winner: "" });
    }
    await saveData();
    closeAddAwardModal();
    renderAwards();
}

init();
