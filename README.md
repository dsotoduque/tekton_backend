# Tekton Test Project

## how to run locally?
 >to run locally is need to run the following scripts. To build the Docker container run
 >`docker build -t tekton-backend .`

 >After that, you need to run the docker container by running command on docker:
 >`docker run -p 3000:3000 tekton-backend`
 
#  Cloud resources explanation:
## ECS Fargate
>Fargate has possibility to scale automatically increasing horizontal scalability as demanded without need to have overheads like using serverless approach. Said this using 4GB of reserved RAM is more tha enough to attend 10.000 write operations rate concurrently and 100.000 read operations rate concurrently. Also the CI/CD deployment gains better customization since I can to configure the deployment strategy from buildspec files.


>Fargate also enable strong versioning strategy with deployment version just if is need to redirect traffic to another deployment if in some case the deployment present an server-side error and it is need to use as migitation strategy.

## ELB 
>ELB is integrated into Fargate to distribute the load between different virtual pods to enable uniform load distribution between different container instances and improve the performance by using it with ECS AutoScaling tool to determine the number of tasks per scale.

## ECS AutoScaling
> It helps to specify the number of tasks which a container can to scale by task definition.

## ECR
> Elastic cointainer registry is the container registry on AWS, it will help to increase compatibility with Fargate facilitating deployment, versioning, rollback strategy and orchestration to build an CI/CD pipeline to deploy the microservice into Fargate


# Design Patterns Description:
Design patterns was used to shape the solution in this repository:
## Singleton.
> Sngleton was used in the creation of components and the configuration into awilix Inversion of Control container to be able to inject into other components by using `.scoped()` method in the container registry definition.

## Dependency Injection.
 > DI was using by implementing the components registry using awilix, it enables delegate the instantation of some class/object to the class that contains by definition, that helps to the memory management to avoid instantiate object until the object was need by the class/object that contains, inverting the responsability and making more efficient with memory management.

## Bridge
> Bridge is using by using class segregation like dividing main app and routers and controller, services and data access to have a better code distribution and ensuring the code structure maintainability.

## Repository Pattern.
> In this case isolates the data access layer compund of neDB in-memory database and lazy cache configuration to the rest of the code.

# N-layers code architecture implementation.
 > By using four layer separately we ensure the logical separation and decoupling the code structure in main (index.js) services (logical processing), controllers (access to http layer) and repositories (That enables de data access).
