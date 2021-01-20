#!/bin/bash

# install az cli
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# install kubectl
az aks install-cli

# install docker (https://docs.docker.com/engine/install/ubuntu/)
sudo apt-get upgrade

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get install docker-ce docker-ce-cli containerd.io -y

# install helm (https://helm.sh/docs/intro/install/)
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3

chmod +x get_helm.sh

./get_helm.sh

rm get_helm.sh

# clone git repo
git clone https://github.com/Azure-Samples/openhack-containers.git
