const $organization = document.getElementById('organization');
const $project = document.getElementById('project');
const $pat = document.getElementById('pat');
const $cacheDuration = document.getElementById('cacheDuration');
const $maxRetries = document.getElementById('maxRetries');
const $retryDelay = document.getElementById('retryDelay');

[$organization, $project, $pat, $cacheDuration, $maxRetries, $retryDelay].forEach(el => {
    el.addEventListener('change', saveSettings);
});

const $testConnection = document.getElementById('testConnection');
const $testResult = document.getElementById('testResult');

$testConnection.addEventListener('click', async () => {
    const settings = {
        organization: $organization.value,
        project: $project.value,
        pat: $pat.value
    };

    if (!settings.organization || !settings.project || !settings.pat) {
        $testResult.textContent = 'Please fill all fields';
        $testResult.style.color = 'red';
        return;
    }

    $testResult.textContent = 'Testing connection...';
    $testResult.style.color = 'inherit';

    try {
        const result = await window.streamDeck.testConnection(settings);
        $testResult.textContent = result.success ? 'Connection successful!' : 'Connection failed';
        $testResult.style.color = result.success ? 'green' : 'red';
    } catch (error) {
        $testResult.textContent = 'Connection failed';
        $testResult.style.color = 'red';
        console.error('Connection test failed:', error);
    }
});

function saveSettings() {
    const settings = {
        organization: $organization.value,
        project: $project.value,
        pat: $pat.value,
        cacheDuration: Number($cacheDuration.value),
        maxRetries: Number($maxRetries.value),
        retryDelay: Number($retryDelay.value)
    };
    window.streamDeck.setSettings(settings);
}

window.streamDeck.onDidReceiveSettings(({ settings }) => {
    $organization.value = settings.organization || '';
    $project.value = settings.project || '';
    $pat.value = settings.pat || '';
    $cacheDuration.value = settings.cacheDuration || 30000;
    $maxRetries.value = settings.maxRetries || 3;
    $retryDelay.value = settings.retryDelay || 1000;
});
