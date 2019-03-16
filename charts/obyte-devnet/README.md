# Obyte-devnet

[Obyte](https://obyte.org/) uses peer-to-peer technology to operate with no central authority or banks;
managing transactions and the issuing of bytes is carried out collectively by the network.

## Introduction

This chart bootstraps a Obyte witness and hub deployments on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- Kubernetes 1.8+
- PV provisioner support in the underlying infrastructure

## Installing the Chart

To install the chart with the release name `my-release`:

```bash
$ helm install --name my-release obyte-devnet
```

The command deploys obyte-devnet on the Kubernetes cluster in the default configuration.
The [configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the obyte-devnet chart and their default values.

Parameter                  | Description                        | Default
-----------------------    | ---------------------------------- | ----------------------------------------------------------
`image.repository`         | Image source repository name       | `pmiklos/obyte-devnet`
`image.tag`                | `obyte-devnet` release tag.     | `0.2.94`
`image.pullPolicy`         | Image pull policy                  | `IfNotPresent`
`persistence.enabled`      | Create a volume to store data      | `true`
`persistence.accessMode`   | ReadWriteOnce or ReadOnly          | `ReadWriteOnce`
`persistence.size`         | Size of persistent volume claim    | `1Gi`
`persistence.storageClass` | Persistent volume storage class    |
`persistence.existingClaim`| Name of existing persistent volume |
`witness.configuration`    | Config file ConfigMap entry        |

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```bash
$ helm install --name my-release -f values.yaml obyte-devnet
```

> **Tip**: You can use the default [values.yaml](values.yaml)

## Persistence

The obyte-devnet image stores the Obyte witness and hub data and configurations at the `/root/.config` path of the container.

By default a PersistentVolumeClaim is created and mounted into that directory. In order to disable this functionality
you can change the values.yaml to disable persistence and use an emptyDir instead.

> *"An emptyDir volume is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node. When a Pod is removed from a node for any reason, the data in the emptyDir is deleted forever."*

