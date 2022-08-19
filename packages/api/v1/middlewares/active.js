let userAccessMap = new Map();
const cleanupFrequency = 30 * 60 * 1000; 
const cleanupTarget = 1 * 24 * 60 * 60 * 1000;

const active = async (req,res,next) => {
  let { id } = req.kuserData;
  let lastAccess = Date.now();
  userAccessMap.set(id, lastAccess);
  req.active = userAccessMap;
  next();
};

const active_control = async( active ) => {
  return setInterval(() => {
    let now = Date.now();
    for(let [id, lastAccess] of active.entries()){
      if((now - lastAccess) > cleanupTarget){
        active.delete(id);
      }
    }
  }, cleanupFrequency);
};

module.exports = { active, active_control } ;