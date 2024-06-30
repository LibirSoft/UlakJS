# UlakJS
UlakJS created for using socket.io easier way

## Installation
```bash
npm install socket.io ulakjs
```
## Examples
For using ulakJS you need to create server with socket.io.

```typescript
import {Server} from 'socket.io';
import {Ulak} from "Ulak";
import {serialize} from "cookie";

const server = new Server();

const ulak = new Ulak(server);

ulak.start(() => {
    server.listen(3000);
})
```

Then you need to create `NamespaceFactory` for handling namespaces.
```typescript
// TestNamespaceFactory.ts
@NamespaceFactory()
class TestNamespaceFactory extends UlakNamespaceFactory {
    // all params is optional but if you give a namespace name twice, it will throw an error
    // if you don't give a namespace name, it will be default namespace
    @NameSpace({ namespace: '/test', description: 'Test namespace', middlewares: [] })
    public test(): UlakEventFactory[] {
        // we need add our ulak event factories here
        return [];
    }
    
    
    @NameSpace({ namespace: '/admin', description: 'Admin namespace', middlewares: [] })
    public adminNamespace(): UlakEventFactory[] {
        // we need add our ulak event factories here
        return [];
    }
}
```
then add it to your `Ulak` class.
```typescript
const server = new Server();

const ulak = new Ulak(server);

ulak.addNamespaceFactory(new TestNamespaceFactory()).start(() => {
    server.listen(3000);
    console.log('Server started on port 3000');
});
````

All your namespaces will be created in `TestNamespaceFactory` class.

### Events

Then you need to create `EventFactory` for handling events.
```typescript
// TestEventFactory.ts
@EventFactory()
class TestEventFactory extends UlakEventFactory {
    // if you give a event name twice, it will throw an error
    @Event('message')
    public test(data: any): void {
        // we need add our event logic here
        if (data === 'ping') {
            this.socket.emit('message', 'ping');
        }
        this.socket.emit('message', 'why you send me ' + data + ' ?');
    }
}
```
You can create multiple events in `TestEventFactory` class also you can create multiple EventFactory classes.

Then you need to add your `EventFactory` classes to `NamespaceFactory` class.
```typescript
// TestNamespaceFactory.ts
@NamespaceFactory()
class TestNamespaceFactory extends UlakNamespaceFactory {
   
    @NameSpace({ namespace: '/test', description: 'Test namespace', middlewares: [] })
    public test(): UlakEventFactory[] {
        // we need add our ulak event factories here
        return [new TestEventFactory()];
    }
}
```

### Middlewares
You can add middlewares to your namespace.

```typescript
// testMiddleware.ts
const testMiddleware = (socket: Socket, next: any) => {
    console.log('middleware');
    next();
}
```

```typescript
// TestNamespaceFactory.ts

// if you add middlewares to NamespaceFactory, it will be added global 
@NamespaceFactory([testMiddleware]) 
class TestNamespaceFactory extends UlakNamespaceFactory {

    // if you add middlewares to NameSpace, it will be added to only this namespace. you can add multiple middlewares
    @NameSpace({ namespace: '/test', description: 'Test namespace', middlewares: [] })
    public test(): UlakEventFactory[] {
        // we need add our ulak event factories here
        return [new UlakEventFactory()];
    }
}
```

### Room usage

You can add your socket to room with `join` method.

```typescript
@EventFactory()
class TestEventFactory extends UlakEventFactory {
    
    @Event('join')
    public test(data: any): void {
        
        this.socket.join('room1');
    }
}
```

You can send message to room with `io.to` method but this will only send message to default namespace.

```typescript
@EventFactory()
class TestEventFactory extends UlakEventFactory {
    
    @Event('message')
    public test(data: any): void {
        
        this.io.to('room1').emit('message', 'hello room1');
    }
}
```
If you want to send message to EventFactories namespace, you need to use `namespace.to` method.

```typescript
@EventFactory()
class TestEventFactory extends UlakEventFactory {

    @Event('message')
    public test(data: any): void {
        
        this.namespace.to('room1').emit('message', 'hello room1');
    }
}
```