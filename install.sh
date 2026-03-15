#! /bin/bash
set -e

NAME=rounded-screen-corners
DOMAIN=nopan
UUID=$NAME@$DOMAIN
ZIP_NAME=$UUID.shell-extension.zip

# Findout gnome-shell version
SHELL_VERSION=$(gnome-shell --version | cut -d ' ' -f3 | cut -d '.' -f1)

if [[ $SHELL_VERSION -lt 45 ]]
then
    echo "This script is not for the gnome-shell versions below 45, Exiting with no changes."
    exit 1
fi

echo -e "\n\n\t~~~~~~~~~~~~~~~~ rounded-screen-corners ~~~~~~~~~~~~~~~~\n"
echo -e "\trunning the script...\n"
echo -e "\t1. gnome-shell version $SHELL_VERSION detected"

echo -e "\t2. Creating extension pack..."
gnome-extensions pack --force --out-dir . --extra-source=corners --extra-source=schemas . && echo -e "\t3. extension pack created"

echo -e "\t4. Installing the extension from the pack...\n"

gnome-extensions install -f $ZIP_NAME
rm -f $ZIP_NAME

echo -e "\t------------------------------------------
\t| rounded-screen-corners is installed    |
\t------------------------------------------

\tNow please logout and login back to enable the extension in X11,
\tor restart gnome shell in Wayland, then enable the extension.
\tYou can configure the rounded corners using the extension preferences."
echo -e "\n\t~~~~~~~~~~~~~~~~~~ Thank You ~~~~~~~~~~~~~~~~~~\n"
exit 0
