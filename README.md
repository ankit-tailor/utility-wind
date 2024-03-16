# Utility Wind

Zero runtime and fully typed utility props support for tailwind classes.

### Usage

```jsx
const App = () => {
  return (
    <div $flex flex={1} bg="black" items="center" justify="center">
      <button
        bg="green-500"
        rounded="md"
        text="white"
        px="5"
        py="3"
        hover={{
          bg: "green-600",
        }}
        active={{
          bg: "green-700",
        }}
        focus={{
          bg: "green-800",
        }}
        focus-visible={{
          bg: "green-900",
        }}
      >
        Hello world
      </button>
    </div>
  );
};
```
