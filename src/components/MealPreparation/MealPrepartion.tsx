"use client";

"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchPantryTasks,
  updatePantryTask,
  deletePantryTask,
} from "@/features/pantry/pantryTask";
import { fetchPatients } from "@/features/patient/patient";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { fetchDietCharts } from "@/features/dietChart/dietChart";

interface MealPreparationProps {
     isPantry: boolean;
     isDelivery: boolean;
}

const MealPreparation = ({ isPantry, isDelivery }: MealPreparationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pantryTasks, error } = useSelector(
    (state: RootState) => state.pantryTask
  );
  const { patients } = useSelector((state: RootState) => state.patient);
  const { dietCharts } = useSelector((state: RootState) => state.diet);
  const [selectedDietChart, setSelectedDietChart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchPantryTasks());
    dispatch(fetchPatients());
    dispatch(fetchDietCharts());
    setLoading(false);
  }, [dispatch]);

  const handleUpdate = ({ id, preparationStatus, deliveryStatus }: any) => {
    dispatch(
      updatePantryTask({
        id,
        pantryTaskData: { preparationStatus, deliveryStatus },
      })
    ).then(() => {
      dispatch(fetchPantryTasks());
    });
  };


  if (loading) return <div className=" p-6"> Loading </div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 w-full rounded-lg flex justify-normal gap-20 md:flex-row flex-col">
      <div className="">
        <h1 className="text-2xl font-semibold mb-6">Pantry Tasks</h1>
        <div className="overflow-x-auto">
          <Table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <TableHeader className="sticky top-0 bg-gray-100 z-10 shadow">
              <TableRow>
                {[
                  "Patient Name",
                  "Room No.",
                  " Bed No. ",
                  "Floor No.",
                  "Updated At",
                  "Preparation Status",
                  "Delivery Status",
                ].map((header) => (
                  <TableCell
                    key={header}
                    className="py-3 px-4 font-semibold text-gray-700"
                  >
                    {header}
                  </TableCell>
                ))}
                {isPantry && (
                  <TableCell className="py-3 px-4 font-semibold text-gray-700">
                    Meal Instructions
                  </TableCell>
                )}

                    {isDelivery && (
                    <TableCell className="py-3 px-4 font-semibold text-gray-700">
                         Delivery Notes
                    </TableCell>
                    )}   

              </TableRow>
            </TableHeader>
            <TableBody>
              {pantryTasks.map((task: any) => (
               
                <TableRow
                  key={task.id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition cursor-pointer "
                >
                  <TableCell className="py-2 px-4 text-gray-600">
                    {
                      patients.find(
                        (patient) => patient?.id === task?.dietChartId
                      )?.name
                    }
                  </TableCell>
     

                  <TableCell className="py-2 px-4 text-gray-600">
                    {
                      patients.find(
                        (patient) => patient?.id === task?.dietChartId
                      )?.roomNumber
                    }
                  </TableCell>

                  <TableCell className="py-2 px-4 text-gray-600">
                    {
                      patients.find(
                        (patient) => patient?.id === task?.dietChartId
                      )?.bedNumber
                    }
                  </TableCell>

                  <TableCell className="py-2 px-4 text-gray-600">
                    {
                      patients.find(
                        (patient) => patient?.id === task?.dietChartId
                      )?.floorNumber
                    }
                  </TableCell>

                  <TableCell className="py-2 px-4 text-gray-600">
                    {task?.updatedAt.split("T")[0]}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-gray-600">
                    {isPantry ? (
                      <Select
                        onValueChange={(value) =>
                          handleUpdate({
                            id: task.id,
                            preparationStatus: value,
                            deliveryStatus: task.deliveryStatus,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={task?.preparationStatus} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Preparation Status</SelectLabel>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Started">Started</SelectItem>
                            <SelectItem value="Finished">Finished</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      task?.preparationStatus
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-gray-600">
                    {isDelivery ? (
                      <Select
                        onValueChange={(value) =>
                          handleUpdate({
                            id: task.id,
                            preparationStatus: task.preparationStatus,
                            deliveryStatus: value,
                          })
                        }
                      >
                        <SelectTrigger className=" capitalize">
                          <SelectValue
                            className=""
                            placeholder={task?.deliveryStatus}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Delivery Status</SelectLabel>
                            <SelectItem value="Not Delivered">
                              Not Delivered
                            </SelectItem>
                            <SelectItem value="Dispatched">
                              Dispatched
                            </SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      task?.deliveryStatus
                    )}
                  </TableCell>

                  {isPantry && (
                    <TableCell className="py-2 px-4 text-gray-600">
                      <Dialog>
                        <DialogTrigger asChild className="mt-4">
                          <Button
                            onClick={() =>
                              setSelectedDietChart(task.dietChartId)
                            }
                          >
                            Meal Instruction
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className=" ">
                              {
                                patients.find(
                                  (patient) => patient?.id === task?.dietChartId
                                )?.name
                              }
                            </DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                              <div className=" flex flex-col gap-4 mt-6">
                              <div className="text-lg font-semibold leading-none tracking-tight">
                                {
                                  dietCharts.find(
                                    (diet) => diet?.id === selectedDietChart
                                  )?.name
                                }
                              </div>
                              <div className="text-gray-600 text-sm">
                                   <span className=" text-black">Ingredients: </span>
                                  
                                {dietCharts
                                  .find(
                                    (diet) => diet?.id === selectedDietChart
                                  )
                                  ?.ingredients.join(", ")}
                              </div>
                              <div className=" text-sm text-gray-600 ">
                                   <span className=" text-black">Instructions: </span>
                                {
                                  dietCharts.find(
                                    (diet) => diet?.id === selectedDietChart
                                  )?.instructions
                                }
                              </div>
                              </div>
     
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}

                    {isDelivery && (
                      <TableCell className="py-2 px-4 text-gray-600">
                         {
                              <Dialog> 
                              <DialogTrigger asChild className="">
                                <Button>
                                  Delivery Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className=" mb-6">
                                    Delivery Notes
                                  </DialogTitle>
                                  <DialogDescription className=" mt-[20px]">
                                    {task?.deliveryNotes? task?.deliveryNotes : "No Delivery Notes"}
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                               </Dialog>

                         }
                      </TableCell>
                    )}


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MealPreparation;
