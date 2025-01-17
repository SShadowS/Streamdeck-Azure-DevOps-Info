const $queryId = document.getElementById('queryId');
const $refreshInterval = document.getElementById('refreshInterval');

$queryId.addEventListener('change', saveSettings);
$refreshInterval.addEventListener('change', saveSettings);

function saveSettings() {
    const settings = {
        queryId: $queryId.value,
        refreshInterval: Number($refreshInterval.value)
    };
    window.streamDeck.setSettings(settings);
}

window.streamDeck.onDidReceiveSettings(({ settings }) => {
    $queryId.value = settings.queryId || '';
    $refreshInterval.value = settings.refreshInterval || 60000;
});
