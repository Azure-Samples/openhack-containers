To deploy Linux VM

```bash
az group create -n <rgname> -l <region>
az deployment group create -g <rgname> -n <deploymentName> --template-file azuredeploy.json --parameters azuredeploy.parameters.json
```