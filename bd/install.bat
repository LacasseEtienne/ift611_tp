echo on

where docker > nul
if %errorlevel% == 0 (goto import_cassandra & exit /b 0)

where choco > nul 
if %errorlevel% == 0 goto install_docker & exit /b 0

goto install_choco
exit /b %errorlevel%

:install_choco
:: Installation de chocolatey
where choco > nul
if %errorlevel% == 0 goto install_docker && exit /b %errorlevel%
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
goto install_docker
exit /b %errorlevel%

:install_docker
:: Installation de docker
choco install docker-desktop -y
if %errorlevel% == 1 echo "L'installation de docker a échouée" & exit /b 1

:: Verification de l'installation de docker
C:\Program Files\Docker\Docker\resources\dockerd.exe
if %errorlevel% == 1 echo "Docker n'est pas installé ou démarré" & exit /b 1

docker run hello-world > nul
if %errorlevel% == 1 echo "Docker n'est pas capable de valider son installation" & docker rmi hello-world & exit /b 1
docker rmi hello-world

goto import_cassandra
exit /b %errorlevel%

:import_cassandra
:: Importation du conteneur pour la base de donnees
docker pull cassandra:latest > nul
if %errorlevel% == 0 echo "Installation de la base de données terminées" & exit /b 0
exit /b 1