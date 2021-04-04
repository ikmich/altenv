# Intro
Change up your environment variables according to your preferred target runtime environment or otherwise.  

### Install
```shell
# with npm
npm install -g altenv

# or with yarn
yarn global add altenv
```

### Usage
1. `init` - Create the `altenv.js` config file. A `.env` file is created in the project root if none exists.  
```shell
$ altenv init
```

2. Edit `altenv.js`  
- Set your preferred default environment variable values in the `defaultEnv` property.  
- Add new target function(s) or update existing function(s) under the `transformers` object. These are used  
  to transform env variables to the preferred values.  
   
3. `use` any of the targets to set/change the values in your `.env` file 
```shell
$ altenv use <target>
```
