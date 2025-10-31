import { StoreData } from '@/types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = 'data/store.json';

export async function getStoreData(): Promise<StoreData> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch store data: ${response.statusText}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  
  return JSON.parse(content);
}

export async function saveStoreData(data: StoreData): Promise<void> {
  // Сначала получаем текущий SHA файла
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
  
  const getCurrentFile = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const currentFile = await getCurrentFile.json();
  const sha = currentFile.sha;

  // Обновляем файл
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update store data from admin panel',
      content,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save store data: ${response.statusText}`);
  }
}
