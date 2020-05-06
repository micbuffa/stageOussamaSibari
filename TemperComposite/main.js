window.Temper = class Temper extends WebAudioPluginCompositeNode {
  constructor(ctx, URL, options) {
    super(ctx, URL, options);
    /*    ################     API PROPERTIES    ###############   */
/*
    this.addParam({
      name: "cutoff",
      defaultValue: 1500,
      minValue: 30,
      maxValue: 2800,
    });
    this.addParam({
      name: "resonance",
      defaultValue: 0.1,
      minValue: 0,
      maxValue: 30,
    });
    */
    super.setup();
  }
createAnalyser() {
  let a = this.context.createAnalyser();
  // Try changing for lower values: 512, 256, 128, 64...
  a.fftSize = 256;
  a.bufferLength = a.frequencyBinCount;
  a.dataArray = new Uint8Array(a.bufferLength);

  return a;
}

  createNodes() {
    this.analyserIn = this.createAnalyser();
    this.analyserOut = this.createAnalyser();
  }
  connectNodes() {
    // On va charger le noeud du Temper d'origine
    var pluginURL = "..";
    var plugin = new FaustTemperOussama(ctx, pluginURL);

    plugin.load().then((node) => {
      this.temperFaust = node; // on le stocke...

      this._input.connect(this.analyserIn);
      this.analyserIn.connect(this.temperFaust);
      node.connect(this.analyserOut);
      this.analyserOut.connect(this._output);
    });
  }

  getAnalyserIn() {
    return this.analyserIn;
  }
  
  getAnalyserOut() {
    return this.analyserOut;
  }

  setParam(key, value) {
    this.temperFaust.setParam(key, value);
  }

  set cutoff(_value) {
    // to store the new value
    this.params.cutoff = _value;
    // if your param is linked to the filter frequency you can :
    this.lpfilter.frequency.setValueAtTime(_value, this.context.currentTime);
  }

  set resonance(_value) {
    // to store the new value
    this.params.resonance = _value;
    // if your param is linked to the filter Q you can :
    this.lpfilter.Q.setValueAtTime(_value, this.context.currentTime);
  }
};

window.WasabiTemper = class WasabiTemper extends WebAudioPluginFactory {
  constructor(context, baseUrl) {
    super(context, baseUrl);
  }
};
