$files = Get-ChildItem -Path packages\charts-bi\src\*.tsx, packages\charts-ds\src\*.tsx

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'formatter=\{\(value: any\) => \[(valueFormatter\(value as number\)), ""\]\}', 'formatter={(value: any, name: any) => [$1, name]}'
    $newContent = $newContent -replace 'formatter=\{\(value: any\) => \[(formatCompactNumber\(value as number\)), ""\]\}', 'formatter={(value: any, name: any) => [$1, name]}'
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated $($file.Name)"
    }
}
