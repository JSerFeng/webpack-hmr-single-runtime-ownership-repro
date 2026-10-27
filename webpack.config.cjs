module.exports = {
  optimization: { moduleIds: "named", chunkIds: "named", concatenateModules: false, splitChunks: { cacheGroups: {
 default: false, defaultVendors: false,
 shared: { test: /(dep|keeper)\.js$/, name: "shared", chunks: "initial", enforce: true, minSize: 0 }
} } },
};
