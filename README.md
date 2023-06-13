# CC-SMEUs

APIs documentation: https://documenter.getpostman.com/view/24378007/2s93mASykW


GCP TOOLS

Cloud Storage:
Cloud Storage is used to store static files, especially images from SME that we have recorded. The total images stored in cloud storage are 320 images from SME in jpeg format. We create a bucket named capstone-smeus and set access permissions to ensure the files can be accessed and displayed on the frontend later. The following is the configuration of the cloud storage that we use:
![Cloud Storage Configuration](https://github.com/Skycyon/CC-SMEUs/assets/102421135/c78b1f07-8423-4a23-90fd-462c334e3ffe)



Cloud IAM:
We use Cloud Identity and Access Management (IAM) to manage security settings and access permissions. We create custom roles with appropriate permissions for each member of the Cloud Computing team, limiting access to only the resources that are needed. The following are the access settings from IAM that we use:
![IAM Configuration](https://github.com/Skycyon/CC-SMEUs/assets/102421135/3d1ddbe3-fc30-4e10-8d60-871e2b4ad5c2)



Cloud SQL:
We use Cloud SQL to store databases from SMEUs applications such as SME data, user data and other data. We create a database instance with type MySQL 8.0 with the instance name smeus-capstone, set users and access permissions, and configure the engine of the instance. Here are the settings for the instance we use:
![SQL Instance Configuration](https://github.com/Skycyon/CC-SMEUs/assets/102421135/639ba082-e40f-4273-b010-08e6709b5f60)

To connect to sql instance from cloud shell, use command "gcloud sql connect smeus=capstone  --user=root --quiet" with the password smeus-capstone.



Compute Engine:
We use Compute Engine to run virtual instances that run SMEUs applications. We create an instance with the name smeus-api-instance then set firewall rules to allow access to the required port so that it makes it easier for the Mobile Development team to access the required API. The following is the configuration of the Compute Engine instance that we use:
![Compute_Engine_Configuration-1](https://github.com/Skycyon/CC-SMEUs/assets/102421135/7356424f-c250-4358-873c-2e00d945fc1a)
![Compute_Engine_Configuration-2](https://github.com/Skycyon/CC-SMEUs/assets/102421135/5e7fe109-6616-49bd-88a6-0f2ab9f38da5)


To run the compute engine instance, connect to SSH and go to directory /var/local/smeus-api and run index.js by writing node index.js.




