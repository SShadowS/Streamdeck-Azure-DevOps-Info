const $organization = document.getElementById('organization');
const $project = document.getElementById('project');
const $pat = document.getElementById('pat');
const $cacheDuration = document.getElementById('cacheDuration');
const $maxRetries = document.getElementById('maxRetries');
const $retryDelay = document.getElementById('retryDelay');

[$organization, $project, $pat, $cacheDuration, $maxRetries, $retryDelay].forEach(el => {
    el.addEventListener('change', saveSettings);
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
