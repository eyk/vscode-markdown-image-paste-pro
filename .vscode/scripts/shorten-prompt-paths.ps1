# Custom PowerShell prompt for vscode-markdown-image-paste-pro workspace
# Shows workspace-relative paths instead of full paths

function prompt {
	$loc = Get-Location
	$workspaceRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
	$workspaceName = "MIPP"

	$path = $loc.Path

	if ($path.StartsWith($workspaceRoot)) {
		$rel = $path.Substring($workspaceRoot.Length).TrimStart('\')
		if ($rel) {
			"PS $workspaceName\$rel> "
		} else {
			"PS $workspaceName> "
		}
	} else {
		# Outside workspace - show last 2 folders
		$parts = $path.Split('\')
		if ($parts.Length -gt 2) {
			$short = $parts[-2..-1] -join '\'
			"PS ..\$short> "
		} else {
			"PS $path> "
		}
	}
}
