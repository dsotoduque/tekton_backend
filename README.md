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


# Infrastructure Architecture Diagram.
> Using a combination of API Gateway ECS Fargate and VPC is enough to deploy our solution with right load distribution using Fargate based ELB to distribute charge between Tasks.



![Diagrama de Infraestructura drawio (1)](https://github.com/dsotoduque/tekton_backend/assets/17690605/ee10bf5c-94e4-4cf8-a989-69ee5cddf08b)


# Software Architecture Diagram.
> Using microservice architecture with isolated in-memory db with RESTful API to service communication isolated into Docker container.



![Software Architecture Diagram drawio](https://github.com/dsotoduque/tekton_backend/assets/17690605/11ea27ee-46bc-48c8-a608-cd1e38b28f58)



# Monitoring Strategy.
> There is 3 architecture monitoring level:
>
> 1. Application level monitoring logging: Inside docker container in directory tmp/log there is files that log the execution time for each request.
> 2. Service level monitoring: Dashboards in CW which is monitoring the cluster service behavior.


> ![monitoring 2](https://github.com/dsotoduque/tekton_backend/assets/17690605/adf1dd95-cea1-470d-9994-30159254e9f1)


>    
> 3.  ELB ALB level monitoring: Whoch log the request/response strategy for evaluate response structure


>    ![monitoring](https://github.com/dsotoduque/tekton_backend/assets/17690605/04b38682-78b3-407c-9da8-1bc064e1c1e2)



