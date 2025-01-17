const $repositoryId = document.getElementById('repositoryId');
const $refreshInterval = document.getElementById('refreshInterval');

$repositoryId.addEventListener('change', saveSettings);
$refreshInterval.addEventListener('change', saveSettings);

function saveSettings() {
    const settings = {
        repositoryId: $repositoryId.value,
        refreshInterval: Number($refreshInterval.value)
    };
    window.streamDeck.setSettings(settings);
}

window.streamDeck.onDidReceiveSettings(({ settings }) => {
    $repositoryId.value = settings.repositoryId || '';
    $refreshInterval.value = settings.refreshInterval || 60000;
});
