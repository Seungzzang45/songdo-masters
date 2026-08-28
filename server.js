// 송도마스터즈 통합 서버 — 투표(/) + 조편성(/jo) + 찬조시상품(/prize) 을 하나의 Express 앱으로 서빙
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const MAX_BACKUPS = 30; // 파일별 최대 백업 개수

const DATA_FILE      = path.join(DATA_DIR, 'data.json');      // 조편성
const GOLF_DATA_FILE = path.join(DATA_DIR, 'golf_data.json'); // 찬조/시상품
const VOTE_DATA_FILE = path.join(DATA_DIR, 'vote_data.json'); // 투표
const NOTICE_FILE    = path.join(DATA_DIR, 'notice.json');    // 공지사항
const PAIR_FILE      = path.join(DATA_DIR, 'pair_data.json'); // 짝꿍대전 토너먼트
const ALPENSIA_FILE  = path.join(DATA_DIR, 'alpensia.json');  // 8월 알펜시아 1박2일 (차량/숙소 배정)
const CUP_FILE       = path.join(DATA_DIR, 'cup_data.json');  // 회장기대회 (당일 스코어/추가 상품)

// 영속 볼륨에 데이터가 없으면 레포에 동봉된 시드 파일을 1회 복사 (기존 데이터 보존)
if (DATA_DIR !== __dirname) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        [['data.json', DATA_FILE], ['golf_data.json', GOLF_DATA_FILE], ['vote_data.json', VOTE_DATA_FILE], ['notice.json', NOTICE_FILE], ['pair_data.json', PAIR_FILE], ['alpensia.json', ALPENSIA_FILE], ['cup_data.json', CUP_FILE]].forEach(([seedName, target]) => {
            const seed = path.join(__dirname, seedName);
            if (!fs.existsSync(target) && fs.existsSync(seed)) {
                fs.copyFileSync(seed, target);
                console.log(`Seeded ${target} from ${seed}`);
            }
        });
    } catch (e) {
        console.error('Volume seed failed:', e);
    }
}

// 백업 디렉토리 생성
if (!fs.existsSync(BACKUP_DIR)) {
    try { fs.mkdirSync(BACKUP_DIR, { recursive: true }); } catch (e) { console.error('백업 폴더 생성 실패:', e); }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// --- 공통 저장 함수 (백업 포함) ---
// 백업이 실패하더라도 본 저장은 반드시 성공하도록 설계
function saveWithBackup(filePath, data) {
    const fileName = path.basename(filePath, '.json');

    // 1. 본 파일 저장 (최우선)
    fs.writeFileSync(filePath, JSON.stringify(data));

    // 2. 백업 디렉토리 준비 (실패해도 무시)
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }
    } catch (e) {
        console.error('백업 폴더 생성 실패 (무시):', e.message);
        return;
    }

    // 3. 백업 생성 (실패해도 무시)
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `${fileName}_${timestamp}.json`);
        fs.copyFileSync(filePath, backupPath);
    } catch (e) {
        console.error('백업 생성 실패 (무시):', e.message);
    }

    // 4. 오래된 백업 정리 (실패해도 무시)
    try {
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith(`${fileName}_`) && f.endsWith('.json'))
            .sort()
            .reverse();
        backups.slice(MAX_BACKUPS).forEach(old => {
            try { fs.unlinkSync(path.join(BACKUP_DIR, old)); } catch (e) {}
        });
    } catch (e) {}
}

// --- 조편성 시스템 API ---
app.get('/api/load', (req, res) => {
    try {
        if (fs.existsSync(DATA_FILE)) res.send(fs.readFileSync(DATA_FILE, 'utf8'));
        else res.send('{}');
    } catch (e) { res.send('{}'); }
});

app.post('/api/save', (req, res) => {
    try {
        saveWithBackup(DATA_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// 조편성 화면에서 투표 현황을 불러올 때 사용 (통합 후에는 로컬 파일 직접 읽기)
app.get('/api/vote-fetch', (req, res) => {
    try {
        if (fs.existsSync(VOTE_DATA_FILE)) res.type('application/json').send(fs.readFileSync(VOTE_DATA_FILE, 'utf8'));
        else res.send('{"polls":[]}');
    } catch (e) { res.send('{"polls":[]}'); }
});

// --- 시상/찬조 관리 API ---
app.get('/api/golf/load', (req, res) => {
    try {
        if (fs.existsSync(GOLF_DATA_FILE)) res.send(fs.readFileSync(GOLF_DATA_FILE, 'utf8'));
        else res.send('{}');
    } catch (e) { res.send('{}'); }
});

app.post('/api/golf/save', (req, res) => {
    try {
        saveWithBackup(GOLF_DATA_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// --- 투표 프로그램 API ---
function readVoteData() {
    try {
        if (fs.existsSync(VOTE_DATA_FILE)) return JSON.parse(fs.readFileSync(VOTE_DATA_FILE, 'utf8'));
    } catch (e) { console.error('vote read 실패:', e); }
    return { polls: [] };
}

app.get('/api/vote/load', (req, res) => {
    try {
        const data = readVoteData();
        // 만료된 투표 자동 마감 (KST 기준) — 클라이언트 전체저장 없이 서버에서 처리
        const todayKST = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        let changed = false;
        (data.polls || []).forEach(p => {
            if (p.status === 'active' && p.date && p.date < todayKST) { p.status = 'closed'; changed = true; }
        });
        if (changed) saveWithBackup(VOTE_DATA_FILE, data);
        res.type('application/json').send(JSON.stringify(data));
    } catch (e) { res.send('{"polls":[]}'); }
});

// 전체 저장 — 동시 투표 유실 방지를 위해 덮어쓰지 않고 서버 데이터와 병합
// (투표: 회원별 최신 timestamp 우선 / 댓글: 합집합 / 서버에만 있는 투표항목: 보존)
app.post('/api/vote/save', (req, res) => {
    try {
        const incoming = req.body && typeof req.body === 'object' ? req.body : { polls: [] };
        incoming.polls = incoming.polls || [];
        const current = readVoteData();
        const curById = {};
        (current.polls || []).forEach(p => { curById[p.id] = p; });

        incoming.polls.forEach(p => {
            const cur = curById[p.id];
            if (!cur) return;
            // 투표 병합: 회원별로 timestamp가 더 최신인 쪽 유지
            const merged = Object.assign({}, p.votes || {});
            Object.entries(cur.votes || {}).forEach(([name, v]) => {
                const inc = merged[name];
                if (!inc || (v.timestamp || 0) > (inc.timestamp || 0)) merged[name] = v;
            });
            p.votes = merged;
            // 댓글 병합: timestamp+이름 기준 합집합
            p.comments = p.comments || [];
            const seen = new Set(p.comments.map(c => (c.timestamp || 0) + '|' + c.name));
            (cur.comments || []).forEach(c => {
                if (!seen.has((c.timestamp || 0) + '|' + c.name)) p.comments.push(c);
            });
            p.comments.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        });
        // 서버에만 있는 투표항목은 보존 (오래된 화면의 저장으로 새 투표가 지워지는 것 방지)
        const incIds = new Set(incoming.polls.map(p => p.id));
        (current.polls || []).forEach(p => { if (!incIds.has(p.id)) incoming.polls.push(p); });

        saveWithBackup(VOTE_DATA_FILE, incoming);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// 투표 1건 등록/변경 — 서버가 최신 데이터에 병합하므로 동시 투표에 안전
app.post('/api/vote/cast', (req, res) => {
    try {
        const { pollId, name, option, reason } = req.body || {};
        if (!pollId || !name || option === undefined) return res.status(400).send('invalid');
        const data = readVoteData();
        const poll = (data.polls || []).find(p => p.id === pollId);
        if (!poll) return res.status(404).send('poll not found');
        if (!poll.votes) poll.votes = {};
        poll.votes[name] = { option: option, reason: reason || '', timestamp: Date.now() };
        saveWithBackup(VOTE_DATA_FILE, data);
        res.send('success');
    } catch (e) {
        console.error('cast 에러:', e);
        res.status(500).send('error');
    }
});

// 투표 1건 취소 (관리자)
app.post('/api/vote/uncast', (req, res) => {
    try {
        const { pollId, name } = req.body || {};
        if (!pollId || !name) return res.status(400).send('invalid');
        const data = readVoteData();
        const poll = (data.polls || []).find(p => p.id === pollId);
        if (!poll) return res.status(404).send('poll not found');
        if (poll.votes) delete poll.votes[name];
        saveWithBackup(VOTE_DATA_FILE, data);
        res.send('success');
    } catch (e) { res.status(500).send('error'); }
});

// 댓글 1건 추가
app.post('/api/vote/comment', (req, res) => {
    try {
        const { pollId, name, text } = req.body || {};
        if (!pollId || !name || !text) return res.status(400).send('invalid');
        const data = readVoteData();
        const poll = (data.polls || []).find(p => p.id === pollId);
        if (!poll) return res.status(404).send('poll not found');
        if (!poll.comments) poll.comments = [];
        poll.comments.push({ name: name, text: text, timestamp: Date.now() });
        saveWithBackup(VOTE_DATA_FILE, data);
        res.send('success');
    } catch (e) { res.status(500).send('error'); }
});

// 투표항목 생성/메타수정 (관리자) — 기존 항목의 투표·댓글은 서버 것을 보존
app.post('/api/vote/poll-upsert', (req, res) => {
    try {
        const p = req.body && req.body.poll;
        if (!p || !p.id) return res.status(400).send('invalid');
        const data = readVoteData();
        const cur = (data.polls || []).find(x => x.id === p.id);
        if (cur) {
            ['type', 'title', 'month', 'date', 'course', 'time', 'fee', 'teams', 'options', 'multiSelect', 'status'].forEach(k => {
                if (p[k] !== undefined) cur[k] = p[k];
            });
        } else {
            p.votes = p.votes || {};
            p.comments = p.comments || [];
            data.polls.push(p);
        }
        saveWithBackup(VOTE_DATA_FILE, data);
        res.send('success');
    } catch (e) { res.status(500).send('error'); }
});

// 투표항목 삭제 (관리자)
app.post('/api/vote/poll-delete', (req, res) => {
    try {
        const { pollId } = req.body || {};
        if (!pollId) return res.status(400).send('invalid');
        const data = readVoteData();
        data.polls = (data.polls || []).filter(p => p.id !== pollId);
        saveWithBackup(VOTE_DATA_FILE, data);
        res.send('success');
    } catch (e) { res.status(500).send('error'); }
});

// --- 공지사항 API ---
app.get('/api/notice/load', (req, res) => {
    try {
        if (fs.existsSync(NOTICE_FILE)) res.send(fs.readFileSync(NOTICE_FILE, 'utf8'));
        else res.send('{"items":[]}');
    } catch (e) { res.send('{"items":[]}'); }
});

app.post('/api/notice/save', (req, res) => {
    try {
        saveWithBackup(NOTICE_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// --- 회장기대회 API (당일 스코어/추가 상품 — 총무 단독 편집) ---
app.get('/api/cup/load', (req, res) => {
    try {
        if (fs.existsSync(CUP_FILE)) res.send(fs.readFileSync(CUP_FILE, 'utf8'));
        else res.send('{}');
    } catch (e) { res.send('{}'); }
});

app.post('/api/cup/save', (req, res) => {
    try {
        saveWithBackup(CUP_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// --- 짝꿍대전 API ---
app.get('/api/pair/load', (req, res) => {
    try {
        if (fs.existsSync(PAIR_FILE)) res.send(fs.readFileSync(PAIR_FILE, 'utf8'));
        else res.send('{}');
    } catch (e) { res.send('{}'); }
});

app.post('/api/pair/save', (req, res) => {
    try {
        saveWithBackup(PAIR_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// --- 알펜시아 1박2일 API (차량/숙소 배정) ---
app.get('/api/alpensia/load', (req, res) => {
    try {
        if (fs.existsSync(ALPENSIA_FILE)) res.send(fs.readFileSync(ALPENSIA_FILE, 'utf8'));
        else res.send('{}');
    } catch (e) { res.send('{}'); }
});

app.post('/api/alpensia/save', (req, res) => {
    try {
        saveWithBackup(ALPENSIA_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
});

// --- 백업 목록 조회 ---
app.get('/api/backups/:type', (req, res) => {
    const type = req.params.type; // 'data' | 'golf_data' | 'vote_data'
    if (!['data', 'golf_data', 'vote_data', 'notice', 'pair_data', 'alpensia', 'cup_data'].includes(type)) {
        return res.status(400).json({ error: '유효하지 않은 타입' });
    }
    try {
        if (!fs.existsSync(BACKUP_DIR)) return res.json([]);
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith(`${type}_`) && f.endsWith('.json'))
            .sort()
            .reverse()
            .map(filename => {
                const stat = fs.statSync(path.join(BACKUP_DIR, filename));
                return { filename, size: stat.size, mtime: stat.mtime };
            });
        res.json(backups);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- 백업 복원 ---
app.post('/api/backups/restore', (req, res) => {
    const { filename, type } = req.body; // type: 'data' | 'golf_data' | 'vote_data'
    if (!filename || !type) return res.status(400).json({ error: 'filename과 type 필요' });
    if (!['data', 'golf_data', 'vote_data', 'notice', 'pair_data', 'alpensia', 'cup_data'].includes(type)) {
        return res.status(400).json({ error: '유효하지 않은 타입' });
    }
    // 경로 순회 방지
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
        return res.status(400).json({ error: '잘못된 파일명' });
    }

    const src = path.join(BACKUP_DIR, filename);
    const dst = path.join(DATA_DIR, `${type}.json`);

    if (!fs.existsSync(src)) return res.status(404).json({ error: '백업 파일 없음' });

    try {
        // 현재 파일도 백업 후 덮어쓰기
        if (fs.existsSync(dst)) {
            const backupData = JSON.parse(fs.readFileSync(dst, 'utf8'));
            saveWithBackup(dst, backupData);
        }
        fs.copyFileSync(src, dst);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- 백업 파일 내용 조회 ---
app.get('/api/backups/content/:filename', (req, res) => {
    const filename = req.params.filename;
    if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
        return res.status(400).send('잘못된 파일명');
    }
    const src = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(src)) return res.status(404).send('백업 파일 없음');
    try {
        res.send(fs.readFileSync(src, 'utf8'));
    } catch (e) {
        res.status(500).send('error');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`송도마스터즈 통합 서버 실행 중: http://0.0.0.0:${PORT}`);
    console.log(`데이터 폴더: ${DATA_DIR}`);
    console.log(`백업 폴더: ${BACKUP_DIR}`);
});
