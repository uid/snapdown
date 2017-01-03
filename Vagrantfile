Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/xenial64"

  config.vm.network "private_network", ip: "10.18.6.130"

  config.vm.provision "shell", path: "setup/development.sh"
end
