import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('the launch page embeds the bundled demo video with playback controls', async () => {
    const launchPage = await readFile(new URL('../index.html', import.meta.url), 'utf8');

    assert.match(launchPage, /<video[^>]*class="demo-video"[^>]*controls[^>]*playsinline/);
    assert.match(launchPage, /<source src="\/demovid\.mp4" type="video\/mp4"/);
    await access(new URL('../public/demovid.mp4', import.meta.url));
});
