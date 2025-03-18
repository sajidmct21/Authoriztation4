import mongoose from "mongoose";
import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandle.js";


// Create Role 
export const createRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!role) {
    throw new ApiError(400, "Role is required");
  }
  const duplicateRole = await Role.findOne({role});
  console.log(duplicateRole);
  if (duplicateRole) {
    throw new ApiError(400, `${role} role is already exist`);
  }
  const r = new Role({ role });
  await r.save();
  res.status(201).json(new ApiResponse(201, "Role is created", r));
});

// Get All Roles 
export const getAllRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find();
  if(roles.length === 0){
    throw new ApiError(401,"No role to find")
  }
  res.status(200).json(new ApiResponse(200,'All Roles', roles))
});


// Get Role By Id 
export const getRoleById = asyncHandler(async (req, res, next) => {
  const {id} = req.params.id
  if(id === null){
    throw new ApiError(401.`${id} does not exist`)
  }

  if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ApiError(401.`${id} is not valid`)
  }
  const r = await Role.findById(req.params.id)
  if(!r){
    throw new ApiError(401,`Not Found`)
  }
  res.status(200).json(new ApiResponse(200, `Role is find`, r))
});

// Update Role 
export const updateRole = asyncHandler(async (req, res, next) => {
  const {id} = req.params.id
  if(id === null){
    throw new ApiError(401.`${id} does not exist`)
  }

  if(!mongoose.Types.ObjectId.isValid(id)){
    throw new ApiError(401.`${id} is not valid`)
  }
  const r = await Role.findById(req.params.id)
  if(!r){
    throw new ApiError(401,`Not Found`)
  }
  const newRole = await Role.findByIdAndUpdate(req.params.id, req.body, {new:true})
  res.status(200).json(new ApiResponse(200, `Role is updated`, newRole))
});

// Delete Role 
export const deleteRole = asyncHandler(async (req, res, next) => {
  if(req.params.id==null){
    throw new ApiError(401,'Id does not exist')
  }
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    throw new ApiError(401,`Id is not valid`)
  }
  const r = await Role.findById(req.params.id)
  if(!r){
    throw new ApiError(404,'Role is not found')
  }
  await Role.findByIdAndDelete(req.params.id)
  res.status(200).json(new ApiResponse(200,'Role is deleted', null))
});
