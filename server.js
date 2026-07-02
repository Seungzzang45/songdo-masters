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

// 영속 볼륨에 데이터가 없으면 레포에 동봉된 시드 파일을 1회 복사 (기존 데이터 보존)
if (DATA_DIR !== __dirname) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        [['data.json', DATA_FILE], ['golf_data.json', GOLF_DATA_FILE], ['vote_data.json', VOTE_DATA_FILE], ['notice.json', NOTICE_FILE], ['pair_data.json', PAIR_FILE]].forEach(([seedName, target]) => {
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
app.get('/api/vote/load', (req, res) => {
    try {
        if (fs.existsSync(VOTE_DATA_FILE)) res.send(fs.readFileSync(VOTE_DATA_FILE, 'utf8'));
        else res.send('{"polls":[]}');
    } catch (e) { res.send('{"polls":[]}'); }
});

app.post('/api/vote/save', (req, res) => {
    try {
        saveWithBackup(VOTE_DATA_FILE, req.body);
        res.send('success');
    } catch (e) {
        console.error('저장 에러:', e);
        res.status(500).send('저장 실패: ' + e.message);
    }
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

// --- 백업 목록 조회 ---
app.get('/api/backups/:type', (req, res) => {
    const type = req.params.type; // 'data' | 'golf_data' | 'vote_data'
    if (!['data', 'golf_data', 'vote_data', 'notice', 'pair_data'].includes(type)) {
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
    if (!['data', 'golf_data', 'vote_data', 'notice', 'pair_data'].includes(type)) {
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
