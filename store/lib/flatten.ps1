param([string]$Dir)

# Re-saves every PNG in $Dir as 24-bit RGB (no alpha), as the Chrome Web Store requires.
Add-Type -AssemblyName System.Drawing

Get-ChildItem -LiteralPath $Dir -Filter *.png | ForEach-Object {
  $path = $_.FullName
  $src = [System.Drawing.Image]::FromFile($path)
  $bmp = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $bmp.SetResolution(96, 96)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Black)
  $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
  $g.Dispose()
  $src.Dispose()
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}
