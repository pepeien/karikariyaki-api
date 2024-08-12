import { Router } from 'express';
import { Operator, OperatorRole, OrderStatus, Telemetry } from 'karikarihelper';

// Services
import { EventService, OrderService, RealmService, ResponseService } from '@services';

const router = Router();

router.get('/popular-product', async (req, res) => {
    try {
        const operator = res.locals.operator as Operator;
        const events = (await EventService.query({})).filter(
            (event) => new Date(event.date).getTime() < Date.now(),
        );

        const orderedProducts: Map<string, number> = new Map<string, number>();

        events.forEach((event) => {
            event.orders.forEach((order) => {
                if (
                    operator.role !== OperatorRole.ADMIN &&
                    order.realm._id.toString() !== operator.realm._id.toString()
                ) {
                    return;
                }

                order.items.forEach((item) => {
                    const currentCount = orderedProducts.get(item.product.name);

                    if (currentCount) {
                        orderedProducts.set(item.product.name, currentCount + 1);

                        return;
                    }

                    orderedProducts.set(item.product.name, 1);
                });
            });
        });

        const telemetry = {
            title: '',
            data: '',
        } as Telemetry<string>;

        let productOrderCount = 0;

        orderedProducts.forEach((value, key) => {
            const medianValue = value / events.length;

            if (productOrderCount < medianValue) {
                productOrderCount = medianValue;

                telemetry.data = key;
            }
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(telemetry));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/faster-stand', async (req, res) => {
    try {
        const realms = await RealmService.query(res.locals.operator as Operator, {});
        const events = (await EventService.query({})).filter(
            (event) => new Date(event.date).getTime() < Date.now(),
        );

        const orderTimingMap: Map<string, number> = new Map<string, number>();

        realms.forEach((realm) => {
            let totalOrderTimingInSeconds = 0;
            let totalOrderItemCount = 0;

            events.forEach((event) => {
                event.orders
                    .filter((order) => order.realm._id.toString() === realm._id.toString())
                    .forEach((order) => {
                        totalOrderTimingInSeconds +=
                            (new Date(order.updatedAt).getTime() -
                                new Date(order.createdAt).getTime()) /
                            1000;

                        totalOrderItemCount += order.items.length;
                    });
            });

            if (totalOrderItemCount === 0) {
                orderTimingMap.set(realm.name, totalOrderTimingInSeconds);

                return;
            }

            orderTimingMap.set(
                realm.name,
                totalOrderTimingInSeconds / totalOrderItemCount / events.length,
            );
        });

        const telemetry = {
            title: '',
            data: 0,
        } as Telemetry<number>;

        let minOrderingTiming = Number.MAX_SAFE_INTEGER;

        orderTimingMap.forEach((value, key) => {
            if (value > minOrderingTiming || value === 0) {
                return;
            }

            minOrderingTiming = value;

            telemetry.title = key;
            telemetry.data = value;
        });

        res.status(200).json(ResponseService.generateSucessfulResponse(telemetry));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

router.get('/order-queue', async (req, res) => {
    try {
        const operator = res.locals.operator as Operator;
        const latestEventOrders = (await OrderService.query(operator, {})).filter(
            (order) => order.status !== OrderStatus.PICKED_UP,
        );

        const telemetry = {
            title: '',
            data: latestEventOrders.length,
        } as Telemetry<number>;

        res.status(200).json(ResponseService.generateSucessfulResponse(telemetry));
    } catch (error) {
        res.status(error.code ?? 500).json(ResponseService.generateFailedResponse(error.message));
    }
});

export default router;
