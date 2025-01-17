const $organization = document.getElementById('organization');
const $project = document.getElementById('project');
const $pat = document.getElementById('pat');
const $cacheDuration = document.getElementById('cacheDuration');

[$organization, $project, $pat, $cacheDuration].forEach(el => {
    el.addEventListener('change', saveSettings);
});

function saveSettings() {
    const settings = {
        organization: $organization.value,
        project: $project.value,
        pat: $pat.value,
        cacheDuration: Number($cacheDuration.value)
    };
    window.streamDeck.setSettings(settings);
}

window.streamDeck.onDidReceiveSettings(({ settings }) => {
    $organization.value = settings.organization || '';
    $project.value = settings.project || '';
    $pat.value = settings.pat || '';
    $cacheDuration.value = settings.cacheDuration || 30000;
});
