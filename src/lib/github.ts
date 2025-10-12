// src/lib/github.ts - GitHub API integration for committing data changes
import type { Project, Experience, Education, Testimonial, Post, VisitedPlace, SiteSettings, Suggestion } from './types';

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Kaushik-Iyer';
const GITHUB_REPO = process.env.GITHUB_REPO || 'kaushikiyer';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'v2';

type DataType = Project | Experience | Education | Testimonial | Post | VisitedPlace | SiteSettings | Suggestion;

interface GitHubFile {
  sha: string;
  content: string;
}

/**
 * Commit a data file to GitHub
 * This is used in production where the file system is read-only
 */
export async function commitDataToGithub<T extends DataType>(
  filename: string,
  data: T[],
  commitMessage?: string
): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN not configured');
    throw new Error('GitHub token not configured');
  }

  try {
    const filePath = `data/${filename}`;
    const message = commitMessage || `Update ${filename} via admin panel`;

    // 1. Get the current file to obtain its SHA
    const fileUrl = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
    
    const fileResponse = await fetch(fileUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!fileResponse.ok) {
      console.error('Failed to fetch file from GitHub:', await fileResponse.text());
      throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
    }

    const fileData: GitHubFile = await fileResponse.json();
    
    // 2. Prepare the new content
    const content = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    // 3. Update the file
    const updateUrl = `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha: fileData.sha,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update file on GitHub:', errorText);
      throw new Error(`Failed to update file: ${updateResponse.statusText}`);
    }

    console.log(`Successfully committed ${filename} to GitHub`);
    return true;
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    throw error;
  }
}

/**
 * Trigger Vercel redeployment after data changes
 * This ensures the static data is updated in production
 */
export async function triggerVercelRedeploy(): Promise<void> {
  const deployHook = process.env.VERCEL_DEPLOY_HOOK;
  
  if (!deployHook) {
    console.log('No Vercel deploy hook configured, skipping redeploy');
    return;
  }

  try {
    const response = await fetch(deployHook, {
      method: 'POST',
    });

    if (response.ok) {
      console.log('Vercel redeploy triggered successfully');
    } else {
      console.error('Failed to trigger Vercel redeploy:', response.statusText);
    }
  } catch (error) {
    console.error('Error triggering Vercel redeploy:', error);
  }
}
