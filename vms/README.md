# Container OpenHack temporary VM

## Included Utilities

* [Git](https://git-scm.com/)
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/?view=azure-cli-latest)
* [Kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)
* [Helm](https://helm.sh/)

## Linux VM deployment

```bash
az group create -n <rgname> -l <region>
az deployment group create -g <rgname> -n <deploymentName> --template-file linux/azuredeploy.json --parameters linux/azuredeploy.parameters.json
```