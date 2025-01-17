const $pipelineId = document.getElementById('pipelineId');
const $refreshInterval = document.getElementById('refreshInterval');

$pipelineId.addEventListener('change', saveSettings);
$refreshInterval.addEventListener('change', saveSettings);

function saveSettings() {
    const settings = {
        pipelineId: Number($pipelineId.value),
        refreshInterval: Number($refreshInterval.value)
    };
    window.streamDeck.setSettings(settings);
}

window.streamDeck.onDidReceiveSettings(({ settings }) => {
    $pipelineId.value = settings.pipelineId || '';
    $refreshInterval.value = settings.refreshInterval || 30000;
});
